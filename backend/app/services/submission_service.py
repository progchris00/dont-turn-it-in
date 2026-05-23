from sqlmodel import Session

from app.models import Submission


def create_submission(
    *,
    session: Session,
    text: str,
    prediction: str,
    ai_probability: float,
    user_id,
    activity_id,
    aiflag: str | None = None,
) -> Submission:
    submission = Submission(
        text=text,
        prediction=prediction,
        ai_probability=ai_probability,
        user_id=user_id,
        activity_id=activity_id,
        aiflag=aiflag,
    )
    session.add(submission)
    session.commit()
    session.refresh(submission)
    return submission