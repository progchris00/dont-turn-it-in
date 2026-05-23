import uuid

from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import settings
from app.models import Activity, ActivitySection, Section, Submission, User


def create_random_activity(db: Session, title: str = "Activity A") -> Activity:
    activity = Activity(
        activity_title=title,
        description="Activity description",
        deadline="2026-06-01",
        is_active=True,
    )
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity


def test_create_activity(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {
        "activity_title": "Activity C",
        "description": "Description",
        "deadline": "2026-06-10",
        "is_active": True,
    }
    response = client.post(
        f"{settings.API_V1_STR}/activities/",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["activity_title"] == data["activity_title"]
    assert content["description"] == data["description"]
    assert content["deadline"] == data["deadline"]
    assert "id" in content


def test_read_activity(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    activity = create_random_activity(db)
    response = client.get(
        f"{settings.API_V1_STR}/activities/{activity.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["activity_title"] == activity.activity_title
    assert content["id"] == str(activity.id)


def test_read_activity_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/activities/{uuid.uuid4()}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Activity not found"


def test_read_activities(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    create_random_activity(db, title="Activity X")
    create_random_activity(db, title="Activity Y")
    response = client.get(
        f"{settings.API_V1_STR}/activities/",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert len(content["data"]) >= 2


def test_update_activity(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    activity = create_random_activity(db)
    data = {
        "activity_title": "Updated Activity",
        "description": "Updated description",
        "deadline": "2026-06-20",
        "is_active": False,
    }
    response = client.put(
        f"{settings.API_V1_STR}/activities/{activity.id}",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["activity_title"] == data["activity_title"]
    assert content["description"] == data["description"]
    assert content["deadline"] == data["deadline"]
    assert content["is_active"] is False


def test_update_activity_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {
        "activity_title": "Updated Activity",
        "description": "Updated description",
        "deadline": "2026-06-20",
    }
    response = client.put(
        f"{settings.API_V1_STR}/activities/{uuid.uuid4()}",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Activity not found"


def test_delete_activity(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    section = Section(name="Section A")
    db.add(section)
    db.commit()
    db.refresh(section)

    activity = create_random_activity(db)
    db.add(ActivitySection(activity_id=activity.id, section_id=section.id))
    db.add(Submission(text="submission", activity_id=activity.id))
    db.commit()

    response = client.delete(
        f"{settings.API_V1_STR}/activities/{activity.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["message"] == "Activity deleted successfully"


def test_delete_activity_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.delete(
        f"{settings.API_V1_STR}/activities/{uuid.uuid4()}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Activity not found"