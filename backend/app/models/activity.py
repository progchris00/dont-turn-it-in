from typing import Optional
from sqlmodel import SQLModel, Field


class Activity(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    activity_title: str
    description: str
    deadline: str
    is_active: bool = Field(default=True)


class ActivityResponse(SQLModel):
    """Response model for Activity"""
    id: int
    activityTitle: str
    description: str
    deadline: str
