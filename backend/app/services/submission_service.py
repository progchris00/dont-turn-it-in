from sqlmodel import Session

from app.models.submission import Submission


def create_submission(
    session: Session,
    text: str,
    prediction: str,
    ai_probability: float
):

    submission = Submission(
        text=text,
        prediction=prediction,
        ai_probability=ai_probability
    )

    session.add(submission)

    session.commit()

    session.refresh(submission)

    return submission