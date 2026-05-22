from datetime import datetime

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlmodel import Session, SQLModel, select

from app.auth import get_current_student
from app.database import get_session
from app.ml.predictor import predict_text
from app.models.activity import Activity
from app.models.activity_section import ActivitySection
from app.models.submission import Submission
from app.models.student import Student
from app.services.submission_service import create_submission

router = APIRouter(prefix="/api/student", tags=["submissions"])


class SubmissionResponse(SQLModel):
    id: int
    studentName: str
    activityTitle: str
    submittedAt: datetime
    aiflag: str
    aiPercent: float


@router.get("/submissions", response_model=list[SubmissionResponse])
async def get_submissions(
    session: Session = Depends(get_session),
    current_student: Student = Depends(get_current_student),
):
    statement = (
        select(Submission, Student, Activity)
        .join(Student, Submission.student_id == Student.id, isouter=True)
        .join(Activity, Submission.activity_id == Activity.id, isouter=True)
        .where(Submission.student_id == current_student.id)
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
            aiPercent=float(submission.ai_probability),
        )
        for submission, student, activity in rows
    ]


@router.post("/submissions", response_model=SubmissionResponse)
async def create_student_submission(
    activity_id: int = Form(...),
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    current_student: Student = Depends(get_current_student),
):
    if current_student.section_id is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Student is not assigned to a section",
        )

    if not file.filename.endswith(".txt"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only .txt files are supported",
        )

    content = await file.read()
    text = content.decode("utf-8")

    activity = session.exec(
        select(Activity).where(Activity.id == activity_id, Activity.is_active == True)
    ).first()
    if not activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")

    assignment = session.exec(
        select(ActivitySection).where(
            ActivitySection.activity_id == activity.id,
            ActivitySection.section_id == current_student.section_id,
            ActivitySection.is_active == True,
        )
    ).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Activity is not assigned to this student's section",
        )

    result = predict_text(text)
    submission = create_submission(
        session=session,
        text=text,
        prediction=result["prediction"],
        ai_probability=float(result["ai_probability"]),
        student_id=current_student.id,
        activity_id=activity.id,
        aiflag=result["prediction"],
    )

    return SubmissionResponse(
        id=submission.id,
        studentName=current_student.student_name,
        activityTitle=activity.activity_title,
        submittedAt=submission.submitted_at,
        aiflag=submission.aiflag or submission.prediction,
        aiPercent=float(submission.ai_probability),
    )