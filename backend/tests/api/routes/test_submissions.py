from fastapi.testclient import TestClient
from sqlmodel import Session, select

from app.core.config import settings
from app.models import Activity, ActivitySection, Section, Submission, User


def test_read_submissions(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    section = Section(name="Section A")
    db.add(section)
    db.commit()
    db.refresh(section)

    user = db.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    assert user is not None
    user.section_id = section.id
    db.add(user)

    activity = Activity(
        activity_title="Submission Activity",
        description="Test activity",
        deadline="2026-06-01",
        is_active=True,
    )
    db.add(activity)
    db.commit()
    db.refresh(activity)

    db.add(
        ActivitySection(
            activity_id=activity.id, section_id=section.id, is_active=True
        )
    )
    db.add(
        Submission(
            text="hello world",
            user_id=user.id,
            activity_id=activity.id,
            prediction="Human",
            ai_probability=12.5,
        )
    )
    db.commit()

    response = client.get(
        f"{settings.API_V1_STR}/submissions",
        headers=superuser_token_headers,
    )

    assert response.status_code == 200
    content = response.json()
    assert len(content) >= 1
    assert content[0]["activityTitle"] == activity.activity_title