from fastapi import APIRouter, Depends
from sqlmodel import Session, SQLModel, select

from app.database import get_session
from app.models.activity import Activity
from app.models.submission import Submission
from app.models.student import Student

router = APIRouter(prefix="/api/student", tags=["submissions"])


class SubmissionResponse(SQLModel):
    id: int
    studentName: str
    activityTitle: str
    submittedAt: str
    aiflag: str
    aiPercent: float


@router.get("/submissions", response_model=list[SubmissionResponse])
async def get_submissions(session: Session = Depends(get_session)):
    statement = (
        select(Submission, Student, Activity)
        .join(Student, Submission.student_id == Student.id, isouter=True)
        .join(Activity, Submission.activity_id == Activity.id, isouter=True)
        .order_by(Submission.id.desc())
    )
    rows = session.exec(statement).all()

    return [
        SubmissionResponse(
            id=submission.id,
            studentName=student.student_name if student else "Unknown Student",
            activityTitle=activity.activity_title if activity else "Untitled Submission",
            submittedAt=submission.submitted_at,
            aiflag=submission.aiflag or submission.prediction,
            aiPercent=float(submission.ai_probability * 100),
        )
        for submission, student, activity in rows
    ]