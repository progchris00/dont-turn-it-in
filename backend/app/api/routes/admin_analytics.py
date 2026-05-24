from __future__ import annotations

from fastapi import APIRouter, HTTPException
from sqlmodel import col, select


from app.api.deps import CurrentUser, SessionDep
from app.models import Activity, ActivitySection, Submission, User

from app.services.forecast_service import (
    DEFAULT_THRESHOLDS,
    build_student_forecast,
    compute_class_trend_points,
    risk_level_from_avg,
)






router = APIRouter(prefix="/admin/analytics", tags=["admin-analytics"])


def _require_section(current_user: CurrentUser) -> str | None:
    """Return section_id if assigned, or None if superuser without section."""
    if current_user.section_id is not None:
        return str(current_user.section_id)
    if current_user.is_superuser:
        return None  # Superuser can access all sections
    raise HTTPException(status_code=403, detail="User is not assigned to a section")


def _get_section_users(session: SessionDep, section_id: str | None) -> list[User]:
    """Get active users, optionally filtered by section."""
    if section_id is None:
        # Superuser: all active users
        return session.exec(
            select(User).where(User.is_active.is_(True))
        ).all()
    else:
        # Regular user: only users in their section
        return session.exec(
            select(User).where(
                User.section_id == section_id,
                User.is_active.is_(True),
            )
        ).all()







def _get_section_submissions(session: SessionDep, section_id: str | None) -> list[Submission]:
    """Get submissions, optionally filtered by section."""
    if section_id is None:
        # Superuser: all submissions
        return session.exec(select(Submission)).all()
    else:
        # Regular user: submissions from their section
        return session.exec(
            select(Submission)
            .join(User, Submission.user_id == User.id)
            .where(User.section_id == section_id)
        ).all()



@router.get("/overview")
def overview(session: SessionDep, current_user: CurrentUser):
    section_id = _require_section(current_user)

    users = _get_section_users(session, section_id)
    submissions = _get_section_submissions(session, section_id)

    # Next-activity forecast = average of each student's predicted next.
    student_forecasts = []
    for u in users:
        user_subs = [s for s in submissions if s.user_id == u.id]
        student_forecasts.append(
            build_student_forecast(
                session=session,
                user=u,
                past_submissions=list(user_subs),
                cfg=DEFAULT_THRESHOLDS,
            )
        )

    num_students = len(users)
    num_submissions = len(submissions)

    avg_next = (
        sum(f["predicted_ai_percent"] for f in student_forecasts) / len(student_forecasts)
        if student_forecasts
        else 0.0
    )

    class_risk_score, class_risk_label = risk_level_from_avg(avg_next, cfg=DEFAULT_THRESHOLDS)

    return {
        "num_students": num_students,
        "num_submissions": num_submissions,
        "avg_next_ai_percent": round(avg_next, 2),
        "class_risk_score": class_risk_score,
        "class_risk_label": class_risk_label,
    }


@router.get("/ai-distribution")
def ai_distribution(session: SessionDep, current_user: CurrentUser):
    section_id = _require_section(current_user)

    users = _get_section_users(session, section_id)

    counts = {"Low": 0, "Moderate": 0, "High": 0}

    for u in users:
        user_subs = session.exec(select(Submission).where(Submission.user_id == u.id)).all()
        forecast = build_student_forecast(
            session=session,
            user=u,
            past_submissions=list(user_subs),
            cfg=DEFAULT_THRESHOLDS,
        )
        counts[forecast["risk_level"]] += 1

    return {
        "distribution": [
            {"riskScore": 1, "riskLevel": "Low", "studentCount": counts["Low"]},
            {"riskScore": 2, "riskLevel": "Moderate", "studentCount": counts["Moderate"]},
            {"riskScore": 3, "riskLevel": "High", "studentCount": counts["High"]},
        ]
    }


@router.get("/class-trend")
def class_trend(session: SessionDep, current_user: CurrentUser):
    section_id = _require_section(current_user)

    # Determine active activities in this section (or all if superuser), ordered chronologically.
    if section_id is None:
        # Superuser: all active activities
        activities = session.exec(
            select(Activity)
            .where(Activity.is_active.is_(True))
            .order_by(col(Activity.created_at).asc())
        ).all()
    else:
        # Regular user: activities in their section
        activities = session.exec(
            select(Activity)
            .join(ActivitySection, ActivitySection.activity_id == Activity.id)
            .where(
                ActivitySection.section_id == section_id,
                Activity.is_active.is_(True),
                ActivitySection.is_active.is_(True),
            )
            .order_by(col(Activity.created_at).asc())
        ).all()

    # For each activity, compute average ai_probability across submissions by section users.
    activity_series: list[tuple[str, float]] = []
    for a in activities:
        if section_id is None:
            # Superuser: all submissions for activity
            submissions = session.exec(
                select(Submission).where(Submission.activity_id == a.id)
            ).all()
        else:
            # Regular user: only submissions from their section
            submissions = session.exec(
                select(Submission).join(User, Submission.user_id == User.id).where(
                    Submission.activity_id == a.id,
                    User.section_id == section_id,
                )
            ).all()
        if not submissions:
            avg_ai = 0.0
        else:
            avg_ai = sum(float(s.ai_probability) for s in submissions) / len(submissions)
        activity_series.append((a.activity_title, avg_ai))

    # Delegate to service helper.
    points = compute_class_trend_points(ai_series_by_activity=activity_series, cfg=DEFAULT_THRESHOLDS)
    return {"points": points}


@router.get("/student-forecast-line")
def student_forecast_line(session: SessionDep, current_user: CurrentUser):

    section_id = _require_section(current_user)

    users = _get_section_users(session, section_id)

    if section_id is None:
        # Superuser: get most recent activity across all
        upcoming = session.exec(
            select(Activity)
            .where(Activity.is_active.is_(True))
            .order_by(col(Activity.created_at).desc())
            .limit(1)
        ).first()

        # Determine ordered past activities (excluding the upcoming one) to create historical points.
        past_activities = session.exec(
            select(Activity)
            .where(Activity.is_active.is_(True))
            .order_by(col(Activity.created_at).asc())
        ).all()
    else:
        # Regular user: activities in their section
        upcoming = session.exec(
            select(Activity)
            .join(ActivitySection, ActivitySection.activity_id == Activity.id)
            .where(
                ActivitySection.section_id == section_id,
                Activity.is_active.is_(True),
                ActivitySection.is_active.is_(True),
            )
            .order_by(col(Activity.created_at).desc())
            .limit(1)
        ).first()

        # Determine ordered past activities (excluding the upcoming one) to create historical points.
        past_activities = session.exec(
            select(Activity)
            .join(ActivitySection, ActivitySection.activity_id == Activity.id)
            .where(
                ActivitySection.section_id == section_id,
                Activity.is_active.is_(True),
                ActivitySection.is_active.is_(True),
            )
            .order_by(col(Activity.created_at).asc())
        ).all()

    # Build historical + forecast points for each student
    series = []

    for u in users:
        user_subs = session.exec(select(Submission).where(Submission.user_id == u.id)).all()

        # Build historical points per past activity (use avg of submissions for that activity; typically 1).
        # Week numbering is index-based to match frontend rendering.
        points = []
        for idx, a in enumerate(past_activities, start=1):
            subs_for_activity = [s for s in user_subs if s.activity_id == a.id]
            if subs_for_activity:
                avg_ai = sum(float(s.ai_probability) for s in subs_for_activity) / len(subs_for_activity)
            else:
                # If no submission for this activity, treat as 0 to keep series aligned.
                avg_ai = 0.0
            points.append({"week": idx, "aiPercent": round(DEFAULT_THRESHOLDS.clamp(avg_ai), 2), "isForecast": False})

        # Forecast point should reference the upcoming activity index (activity-number indexed).
        # We treat all currently-active activities before the upcoming one as historical.
        forecast = build_student_forecast(
            session=session,
            user=u,
            past_submissions=list(user_subs),
            cfg=DEFAULT_THRESHOLDS,
        )
        points.append({
            "week": len(past_activities) + 1,
            "aiPercent": float(forecast["predicted_ai_percent"]),
            "isForecast": True,
        })


        series.append(
            {
                "studentId": str(u.id),
                "studentName": forecast["student_name"],
                "forecastData": [
                    {

                        "aiPercent": p["aiPercent"],
                        "isForecast": p["isForecast"],
                    }
                    for p in points
                ],


            }
        )


    return {"series": series}



@router.get("/student-table")
def student_table(session: SessionDep, current_user: CurrentUser):
    section_id = _require_section(current_user)

    users = _get_section_users(session, section_id)

    rows = []
    for u in users:
        user_subs = session.exec(select(Submission).where(Submission.user_id == u.id)).all()
        forecast = build_student_forecast(
            session=session,
            user=u,
            past_submissions=list(user_subs),
            cfg=DEFAULT_THRESHOLDS,
        )
        rows.append(
            {
                "studentName": forecast["student_name"],
                "riskScore": forecast["risk_score"],
                "riskLevel": forecast["risk_level"],
                "numSubmissions": forecast["num_submissions"],
                "avgAiPercent": forecast["avg_ai_percent"],
                "predictiveFlag": forecast["predictive_flag"],
                "actionableRemark": forecast["actionable_remark"],
                "predictedAiPercent": forecast["predicted_ai_percent"],
            }
        )

    return {"rows": rows}

