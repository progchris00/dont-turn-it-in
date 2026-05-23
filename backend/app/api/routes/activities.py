from typing import Any

from fastapi import APIRouter, HTTPException, status
from sqlmodel import col, select

from app.api.deps import CurrentUser, SessionDep
from app.models import Activity, ActivityResponse, ActivitySection

router = APIRouter(prefix="/activities", tags=["activities"])


@router.get("/active-activities", response_model=list[ActivityResponse])
def get_active_activities(
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Fetch all active activities for the current user's section.
    """

    if current_user.section_id is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not assigned to a section",
        )

    statement = (
        select(Activity)
        .join(ActivitySection, ActivitySection.activity_id == Activity.id)
        .where(
            Activity.is_active.is_(True),
            ActivitySection.is_active.is_(True),
            ActivitySection.section_id == current_user.section_id,
        )
        .order_by(col(Activity.created_at).desc())
    )
    activities = session.exec(statement).all()

    return [
        ActivityResponse(
            id=activity.id,
            activityTitle=activity.activity_title,
            description=activity.description,
            deadline=activity.deadline,
        )
        for activity in activities
    ]