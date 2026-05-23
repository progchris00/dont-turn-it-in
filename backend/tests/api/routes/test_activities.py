from fastapi.testclient import TestClient
from sqlmodel import Session, select

from app.core.config import settings
from app.models import Activity, ActivitySection, Section, User


def test_read_active_activities(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    section = Section(name="Section A")
    db.add(section)
    db.commit()
    db.refresh(section)

    user = db.exec(select(User).where(User.email == settings.FIRST_SUPERUSER)).first()
    assert user is not None
    user.section_id = section.id
    db.add(user)

    active_activity = Activity(
        activity_title="Read chapter 1",
        description="Read the first chapter",
        deadline="2026-06-01",
        is_active=True,
    )
    inactive_activity = Activity(
        activity_title="Old assignment",
        description="This should not be returned",
        deadline="2026-05-01",
        is_active=False,
    )
    db.add(active_activity)
    db.add(inactive_activity)
    db.commit()
    db.refresh(active_activity)
    db.refresh(inactive_activity)

    db.add(
        ActivitySection(
            activity_id=active_activity.id,
            section_id=section.id,
            is_active=True,
        )
    )
    db.add(
        ActivitySection(
            activity_id=inactive_activity.id,
            section_id=section.id,
            is_active=False,
        )
    )
    db.commit()
    db.refresh(active_activity)
    db.refresh(inactive_activity)

    response = client.get(
        f"{settings.API_V1_STR}/activities/active-activities",
        headers=superuser_token_headers,
    )

    assert response.status_code == 200
    content = response.json()
    assert len(content) == 1
    assert content[0]["activityTitle"] == active_activity.activity_title
    assert content[0]["description"] == active_activity.description
    assert content[0]["deadline"] == active_activity.deadline