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

router = APIRouter(
    prefix="/admin/analytics",
    tags=["admin-analytics"],
)


def _require_section(current_user: CurrentUser) -> str | None:
    """
    Return section_id if assigned,
    or None if superuser without section.
    """
    if current_user.section_id is not None:
        return str(current_user.section_id)

    if current_user.is_superuser:
        return None

    raise HTTPException(
        status_code=403,
        detail="User is not assigned to a section",
    )


def _get_section_users(
    session: SessionDep,
    section_id: str | None,
) -> list[User]:
    """
    Get active users filtered by section if needed.
    """

    query = select(User).where(User.is_active.is_(True))

    if section_id is not None:
        query = query.where(User.section_id == section_id)

    return session.exec(query).all()


def _get_section_submissions(
    session: SessionDep,
    section_id: str | None,
) -> list[Submission]:
    """
    Get submissions filtered by section if needed.
    """

    query = select(Submission)

    if section_id is not None:
        query = (
            query.join(User, Submission.user_id == User.id)
            .where(User.section_id == section_id)
        )

    return session.exec(query).all()


def _get_section_activities(
    session: SessionDep,
    section_id: str | None,
) -> list[Activity]:
    """
    Get active activities ordered chronologically.
    """

    if section_id is None:
        query = (
            select(Activity)
            .where(Activity.is_active.is_(True))
            .order_by(col(Activity.created_at).asc())
        )
    else:
        query = (
            select(Activity)
            .join(
                ActivitySection,
                ActivitySection.activity_id == Activity.id,
            )
            .where(
                ActivitySection.section_id == section_id,
                Activity.is_active.is_(True),
                ActivitySection.is_active.is_(True),
            )
            .order_by(col(Activity.created_at).asc())
        )

    return session.exec(query).all()


@router.get("/overview")
def overview(
    session: SessionDep,
    current_user: CurrentUser,
):
    section_id = _require_section(current_user)

    users = _get_section_users(session, section_id)
    submissions = _get_section_submissions(session, section_id)

    student_forecasts = []

    for user in users:
        user_subs = [
            submission
            for submission in submissions
            if submission.user_id == user.id
        ]

        forecast = build_student_forecast(
            session=session,
            user=user,
            past_submissions=user_subs,
            cfg=DEFAULT_THRESHOLDS,
        )

        student_forecasts.append(forecast)

    num_students = len(users)
    num_submissions = len(submissions)

    avg_next_ai_percent = (
        sum(
            forecast["predicted_ai_percent"]
            for forecast in student_forecasts
        )
        / len(student_forecasts)
        if student_forecasts
        else 0.0
    )

    class_risk_score, class_risk_label = risk_level_from_avg(
        avg_next_ai_percent,
        cfg=DEFAULT_THRESHOLDS,
    )

    return {
        "num_students": num_students,
        "num_submissions": num_submissions,
        "avg_next_ai_percent": round(avg_next_ai_percent, 2),
        "class_risk_score": class_risk_score,
        "class_risk_label": class_risk_label,
    }


@router.get("/ai-distribution")
def ai_distribution(
    session: SessionDep,
    current_user: CurrentUser,
):
    section_id = _require_section(current_user)

    users = _get_section_users(session, section_id)

    counts = {
        "Low": 0,
        "Moderate": 0,
        "High": 0,
    }

    for user in users:
        user_subs = session.exec(
            select(Submission).where(
                Submission.user_id == user.id
            )
        ).all()

        forecast = build_student_forecast(
            session=session,
            user=user,
            past_submissions=user_subs,
            cfg=DEFAULT_THRESHOLDS,
        )

        risk_level = forecast["risk_level"]

        if risk_level in counts:
            counts[risk_level] += 1

    return {
        "distribution": [
            {
                "riskScore": 1,
                "riskLevel": "Low",
                "studentCount": counts["Low"],
            },
            {
                "riskScore": 2,
                "riskLevel": "Moderate",
                "studentCount": counts["Moderate"],
            },
            {
                "riskScore": 3,
                "riskLevel": "High",
                "studentCount": counts["High"],
            },
        ]
    }


@router.get("/class-trend")
def class_trend(
    session: SessionDep,
    current_user: CurrentUser,
):
    section_id = _require_section(current_user)

    activities = _get_section_activities(
        session,
        section_id,
    )

    activity_series: list[tuple[str, float]] = []

    for activity in activities:

        if section_id is None:
            submissions = session.exec(
                select(Submission).where(
                    Submission.activity_id == activity.id
                )
            ).all()
        else:
            submissions = session.exec(
                select(Submission)
                .join(User, Submission.user_id == User.id)
                .where(
                    Submission.activity_id == activity.id,
                    User.section_id == section_id,
                )
            ).all()

        if submissions:
            avg_ai = (
                sum(
                    float(sub.ai_probability)
                    for sub in submissions
                )
                / len(submissions)
            )
        else:
            avg_ai = 0.0

        activity_series.append(
            (
                activity.activity_title,
                avg_ai,
            )
        )

    points = compute_class_trend_points(
        ai_series_by_activity=activity_series,
        cfg=DEFAULT_THRESHOLDS,
    )

    return {
        "points": points,
    }


@router.get("/student-forecast-line")
def student_forecast_line(
    session: SessionDep,
    current_user: CurrentUser,
):
    section_id = _require_section(current_user)

    users = _get_section_users(session, section_id)

    activities = _get_section_activities(
        session,
        section_id,
    )

    series = []

    for user in users:

        user_subs = session.exec(
            select(Submission).where(
                Submission.user_id == user.id
            )
        ).all()

        points = []

        for index, activity in enumerate(activities, start=1):

            subs_for_activity = [
                sub
                for sub in user_subs
                if sub.activity_id == activity.id
            ]

            if subs_for_activity:
                avg_ai = (
                    sum(
                        float(sub.ai_probability)
                        for sub in subs_for_activity
                    )
                    / len(subs_for_activity)
                )
            else:
                avg_ai = 0.0

            points.append(
                {
                    "x": index,
                    "y": round(
                        DEFAULT_THRESHOLDS.clamp(avg_ai),
                        2,
                    ),
                    "isForecast": False,
                }
            )

        forecast = build_student_forecast(
            session=session,
            user=user,
            past_submissions=user_subs,
            cfg=DEFAULT_THRESHOLDS,
        )

        points.append(
            {
                "x": len(activities) + 1,
                "y": round(
                    float(
                        forecast["predicted_ai_percent"]
                    ),
                    2,
                ),
                "isForecast": True,
            }
        )

        series.append(
            {
                "studentId": str(user.id),
                "studentName": forecast["student_name"],
                "points": points,
            }
        )

    return {
        "series": series,
    }


@router.get("/student-table")
def student_table(
    session: SessionDep,
    current_user: CurrentUser,
):
    section_id = _require_section(current_user)

    users = _get_section_users(session, section_id)

    rows = []

    for user in users:

        user_subs = session.exec(
            select(Submission).where(
                Submission.user_id == user.id
            )
        ).all()

        forecast = build_student_forecast(
            session=session,
            user=user,
            past_submissions=user_subs,
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
                "predictedAiPercent": forecast[
                    "predicted_ai_percent"
                ],
            }
        )

    return {
        "rows": rows,
    }

