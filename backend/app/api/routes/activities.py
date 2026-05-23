from typing import Any

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import col, delete, func, select

from app.api.deps import CurrentUser, SessionDep, get_current_active_superuser
from app.models import (
    Activity,
    ActivityCreate,
    ActivityPublic,
    ActivitiesPublic,
    ActivityResponse,
    ActivitySection,
    ActivityUpdate,
    Message,
    Submission,
)

router = APIRouter(prefix="/activities", tags=["activities"])


@router.get(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=ActivitiesPublic,
)
def read_activities(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve activities.
    """

    count_statement = select(func.count()).select_from(Activity)
    count = session.exec(count_statement).one()
    statement = (
        select(Activity).order_by(col(Activity.created_at).desc()).offset(skip).limit(limit)
    )
    activities = session.exec(statement).all()

    activities_public = [ActivityPublic.model_validate(activity) for activity in activities]
    return ActivitiesPublic(data=activities_public, count=count)


@router.get(
    "/{id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=ActivityPublic,
)
def read_activity(session: SessionDep, id: uuid.UUID) -> Any:
    """
    Get activity by ID.
    """

    activity = session.get(Activity, id)
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return activity


@router.post(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=ActivityPublic,
)
def create_activity(*, session: SessionDep, activity_in: ActivityCreate) -> Any:
    """
    Create new activity.
    """

    activity = Activity.model_validate(activity_in)
    session.add(activity)
    session.commit()
    session.refresh(activity)
    return activity


@router.put(
    "/{id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=ActivityPublic,
)
def update_activity(
    *,
    session: SessionDep,
    id: uuid.UUID,
    activity_in: ActivityUpdate,
) -> Any:
    """
    Update an activity.
    """

    activity = session.get(Activity, id)
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    update_dict = activity_in.model_dump(exclude_unset=True)
    activity.sqlmodel_update(update_dict)
    session.add(activity)
    session.commit()
    session.refresh(activity)
    return activity


@router.delete(
    "/{id}",
    dependencies=[Depends(get_current_active_superuser)],
)
def delete_activity(session: SessionDep, id: uuid.UUID) -> Message:
    """
    Delete an activity.
    """

    activity = session.get(Activity, id)
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    activity_sections = session.exec(
        select(ActivitySection).where(ActivitySection.activity_id == id)
    ).all()
    for activity_section in activity_sections:
        session.delete(activity_section)

    submissions = session.exec(select(Submission).where(Submission.activity_id == id)).all()
    for submission in submissions:
        submission.activity_id = None
        session.add(submission)

    session.delete(activity)
    session.commit()
    return Message(message="Activity deleted successfully")


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