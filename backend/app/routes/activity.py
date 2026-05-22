from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.database import get_session
from app.models.activity import Activity, ActivityResponse

router = APIRouter(prefix="/api/student", tags=["activities"])


@router.get("/active-activities", response_model=list[ActivityResponse])
async def get_active_activities(session: Session = Depends(get_session)):
    """
    Fetch all active activities for a student.
    
    Returns a list of Activity objects with the following fields:
    - id: Activity identifier
    - activityTitle: Title of the activity
    - description: Description of the activity
    - deadline: Deadline for the activity
    """
    statement = select(Activity).where(Activity.is_active == True)
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
