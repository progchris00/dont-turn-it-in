from datetime import datetime
from typing import Optional

from sqlmodel import Field, Relationship, SQLModel

from app.models.activity import Activity
from app.models.student import Student

class Submission(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    text: str
    student_id: Optional[int] = Field(default=None, foreign_key="student.id")
    activity_id: Optional[int] = Field(default=None, foreign_key="activity.id")
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    aiflag: Optional[str] = None
    prediction: str = ""
    ai_probability: float = 0.0

    student: Optional[Student] = Relationship()
    activity: Optional[Activity] = Relationship()