import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import col, func, select

from app.api.deps import SessionDep, get_current_active_superuser
from app.models import (
    ActivitySection,
    Message,
    Section,
    SectionCreate,
    SectionPublic,
    SectionsPublic,
    SectionUpdate,
    User,
)

router = APIRouter(prefix="/sections", tags=["sections"])


@router.get(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=SectionsPublic,
)
def read_sections(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve sections.
    """

    count_statement = select(func.count()).select_from(Section)
    count = session.exec(count_statement).one()
    statement = select(Section).order_by(col(Section.name).asc()).offset(skip).limit(limit)
    sections = session.exec(statement).all()

    sections_public = [SectionPublic.model_validate(section) for section in sections]
    return SectionsPublic(data=sections_public, count=count)


@router.get(
    "/{id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=SectionPublic,
)
def read_section(session: SessionDep, id: uuid.UUID) -> Any:
    """
    Get section by ID.
    """

    section = session.get(Section, id)
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    return section


@router.post(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=SectionPublic,
)
def create_section(*, session: SessionDep, section_in: SectionCreate) -> Any:
    """
    Create new section.
    """

    section = Section.model_validate(section_in)
    session.add(section)
    session.commit()
    session.refresh(section)
    return section


@router.put(
    "/{id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=SectionPublic,
)
def update_section(
    *,
    session: SessionDep,
    id: uuid.UUID,
    section_in: SectionUpdate,
) -> Any:
    """
    Update a section.
    """

    section = session.get(Section, id)
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    update_dict = section_in.model_dump(exclude_unset=True)
    section.sqlmodel_update(update_dict)
    session.add(section)
    session.commit()
    session.refresh(section)
    return section


@router.delete(
    "/{id}",
    dependencies=[Depends(get_current_active_superuser)],
)
def delete_section(session: SessionDep, id: uuid.UUID) -> Message:
    """
    Delete a section.
    """

    section = session.get(Section, id)
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")

    users = session.exec(select(User).where(User.section_id == id)).all()
    for user in users:
        user.section_id = None
        session.add(user)

    activity_sections = session.exec(
        select(ActivitySection).where(ActivitySection.section_id == id)
    ).all()
    for activity_section in activity_sections:
        session.delete(activity_section)

    session.delete(section)
    session.commit()
    return Message(message="Section deleted successfully")