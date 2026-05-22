from datetime import datetime, timedelta, timezone
import os

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlmodel import Session, select

from app.database import get_session
from app.models.student import Student


JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-change-me")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

bearer_scheme = HTTPBearer()


class TokenRequest(BaseModel):
    student_id: int


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    student_id: int
    student_name: str
    section_id: int | None = None


class CurrentStudentResponse(BaseModel):
    student_id: int
    student_name: str
    section_id: int | None = None


def create_access_token(student_id: int) -> str:
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(student_id),
        "iat": int(now.timestamp()),
        "exp": expires_at,
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def authenticate_student(session: Session, student_id: int) -> Student:
    student = session.exec(select(Student).where(Student.id == student_id)).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid student credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return student


def get_current_student(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    session: Session = Depends(get_session),
) -> Student:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = credentials.credentials

    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        student_id = payload.get("sub")
        if student_id is None:
            raise credentials_error
        student_id_int = int(student_id)
    except (JWTError, ValueError, TypeError):
        raise credentials_error

    student = session.exec(select(Student).where(Student.id == student_id_int)).first()
    if not student:
        raise credentials_error

    return student
