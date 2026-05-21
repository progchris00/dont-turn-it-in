from fastapi import APIRouter, UploadFile, File, Depends
from sqlmodel import Session

from app.database import get_session
from app.ml.predictor import predict_text
from app.services.submission_service import create_submission

router = APIRouter()


@router.post("/predict")
async def predict_file(
    file: UploadFile = File(...),
    session: Session = Depends(get_session)
):

    if not file.filename.endswith(".txt"):
        return {
            "error": "Only .txt files are supported"
        }

    content = await file.read()

    text = content.decode("utf-8")

    result = predict_text(text)

    submission = create_submission(
        session=session,
        text=text,
        prediction=result["prediction"],
        ai_probability=result["ai_probability"]
    )

    return {
        "message": "File processed successfully",
        "filename": file.filename,
        "submission": submission
    }