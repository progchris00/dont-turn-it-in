from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.auth import get_current_student
from app.database import get_session
from app.models.activity import Activity, ActivityResponse
from app.models.activity_section import ActivitySection
from app.models.student import Student

router = APIRouter(prefix="/api/student", tags=["activities"])


@router.get("/active-activities", response_model=list[ActivityResponse])
async def get_active_activities(
    session: Session = Depends(get_session),
    current_student: Student = Depends(get_current_student),
):
    """
    Fetch all active activities for a student.

    Returns a list of Activity objects with the following fields:
    - id: Activity identifier
    - activityTitle: Title of the activity
    - description: Description of the activity
    - deadline: Deadline for the activity
    """
    if current_student.section_id is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Student is not assigned to a section",
        )

    statement = (
        select(Activity)
        .join(ActivitySection, ActivitySection.activity_id == Activity.id)
        .where(
            Activity.is_active == True,
            ActivitySection.is_active == True,
            ActivitySection.section_id == current_student.section_id,
        )
        .order_by(Activity.id)
    )
    activities = session.exec(statement).all()

    # Transform database model to response model
    return [
        ActivityResponse(
            id=activity.id,
            activityTitle=activity.activity_title,
            description=activity.description,
            deadline=activity.deadline,
        )
        for activity in activities
    ]
