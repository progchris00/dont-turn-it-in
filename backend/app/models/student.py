from typing import Optional

from sqlmodel import Field, SQLModel
from sqlmodel import Relationship
from app.models.section import Section


class Student(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    student_name: str
    section_id: Optional[int] = Field(default=None, foreign_key="section.id")

    section: Optional[Section] = Relationship()
