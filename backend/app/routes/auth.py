from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.auth import (
    CurrentStudentResponse,
    TokenRequest,
    TokenResponse,
    authenticate_student,
    create_access_token,
    get_current_student,
)
from app.database import get_session
from app.models.student import Student


router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/token", response_model=TokenResponse)
async def create_token(payload: TokenRequest, session: Session = Depends(get_session)):
    student = authenticate_student(session, payload.student_id)
    return TokenResponse(
        access_token=create_access_token(student.id),
        student_id=student.id,
        student_name=student.student_name,
        section_id=student.section_id,
    )


@router.get("/me", response_model=CurrentStudentResponse)
async def read_current_student(current_student: Student = Depends(get_current_student)):
    return CurrentStudentResponse(
        student_id=current_student.id,
        student_name=current_student.student_name,
        section_id=current_student.section_id,
    )
