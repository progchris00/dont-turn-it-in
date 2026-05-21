from typing import Optional
from sqlmodel import SQLModel, Field

class Submission(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    text: str
    prediction: str
    ai_probability: float