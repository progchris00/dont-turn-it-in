from typing import Optional

from sqlmodel import Field, SQLModel


class ActivitySection(SQLModel, table=True):
    __tablename__ = "activity_section"

    id: Optional[int] = Field(default=None, primary_key=True)
    activity_id: int = Field(foreign_key="activity.id")
    section_id: int = Field(foreign_key="section.id")
    is_active: bool = Field(default=True)
