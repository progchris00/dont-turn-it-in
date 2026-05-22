from datetime import datetime

from sqlmodel import Session

from app.models.submission import Submission


def create_submission(
    session: Session,
    text: str,
    prediction: str,
    ai_probability: float,
    student_id: int | None = None,
    activity_id: int | None = None,
    submitted_at: datetime | None = None,
    aiflag: str | None = None,
):

    submission = Submission(
        text=text,
        student_id=student_id,
        activity_id=activity_id,
        submitted_at=submitted_at or datetime.utcnow(),
        aiflag=aiflag or prediction,
        prediction=prediction,
        ai_probability=ai_probability,
    )

    session.add(submission)

    session.commit()

    session.refresh(submission)

    return submission