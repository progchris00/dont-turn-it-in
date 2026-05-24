from datetime import datetime
import uuid

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status
from sqlmodel import SQLModel, Session, select

from app.api.deps import CurrentUser, SessionDep
from app.ml.predictor import predict_text
from app.models import Activity, ActivitySection, Submission, User
from app.services.submission_service import create_submission

router = APIRouter(prefix="/submissions", tags=["submissions"])


class SubmissionResponse(SQLModel):
    id: uuid.UUID
    studentName: str
    activityTitle: str
    activityId: uuid.UUID | None
    submittedAt: datetime
    aiflag: str | None
    aiPercent: float


@router.get("", response_model=list[SubmissionResponse])
def get_submissions(
    session: SessionDep,
    current_user: CurrentUser,
):
    statement = (
        select(Submission, User, Activity)
        .join(User, Submission.user_id == User.id, isouter=True)
        .join(Activity, Submission.activity_id == Activity.id, isouter=True)
        .where(Submission.user_id == current_user.id)
        .order_by(Submission.id.desc())
    )
    rows = session.exec(statement).all()

    return [
        SubmissionResponse(
            id=str(submission.id),
            studentName=user.full_name or user.email if user else "Unknown User",
            activityTitle=activity.activity_title if activity else "Untitled Submission",
            activityId=submission.activity_id,
            submittedAt=submission.submitted_at,
            aiflag=submission.aiflag or submission.prediction,
            aiPercent=float(submission.ai_probability),
        )
        for submission, user, activity in rows
    ]


@router.post("", response_model=SubmissionResponse)
async def create_student_submission(
    session: SessionDep,
    current_user: CurrentUser,
    activity_id: uuid.UUID = Form(...),
    file: UploadFile = File(...),
):
    if current_user.section_id is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not assigned to a section",
        )

    if not file.filename.endswith(".txt"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only .txt files are supported",
        )

    content = await file.read()
    text = content.decode("utf-8")

    activity = session.exec(
        select(Activity).where(Activity.id == activity_id, Activity.is_active.is_(True))
    ).first()
    if not activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")

    assignment = session.exec(
        select(ActivitySection).where(
            ActivitySection.activity_id == activity.id,
            ActivitySection.section_id == current_user.section_id,
            ActivitySection.is_active.is_(True),
        )
    ).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Activity is not assigned to this user's section",
        )

    existing_submission = session.exec(
        select(Submission).where(
            Submission.user_id == current_user.id,
            Submission.activity_id == activity.id,
        )
    ).first()
    if existing_submission:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Activity already submitted",
        )

    result = predict_text(text)
    submission = create_submission(
        session=session,
        text=text,
        prediction=result["prediction"],
        ai_probability=float(result["ai_probability"]),
        user_id=current_user.id,
        activity_id=activity.id,
        aiflag=result["prediction"],
    )

    return SubmissionResponse(
        id=submission.id,
        studentName=current_user.full_name or current_user.email,
        activityTitle=activity.activity_title,
        activityId=submission.activity_id,
        submittedAt=submission.submitted_at,
        aiflag=submission.aiflag or submission.prediction,
        aiPercent=float(submission.ai_probability),
    )