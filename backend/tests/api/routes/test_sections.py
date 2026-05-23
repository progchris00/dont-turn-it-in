import uuid

from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import settings
from app.models import Section, User


def create_random_section(db: Session, name: str = "Section A") -> Section:
    section = Section(name=name)
    db.add(section)
    db.commit()
    db.refresh(section)
    return section


def test_create_section(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {"name": "Section C"}
    response = client.post(
        f"{settings.API_V1_STR}/sections/",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["name"] == data["name"]
    assert "id" in content


def test_read_section(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    section = create_random_section(db)
    response = client.get(
        f"{settings.API_V1_STR}/sections/{section.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["name"] == section.name
    assert content["id"] == str(section.id)


def test_read_section_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/sections/{uuid.uuid4()}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Section not found"


def test_read_sections(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    create_random_section(db, name="Section X")
    create_random_section(db, name="Section Y")
    response = client.get(
        f"{settings.API_V1_STR}/sections/",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert len(content["data"]) >= 2


def test_update_section(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    section = create_random_section(db)
    data = {"name": "Updated Section"}
    response = client.put(
        f"{settings.API_V1_STR}/sections/{section.id}",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["name"] == data["name"]
    assert content["id"] == str(section.id)


def test_update_section_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {"name": "Updated Section"}
    response = client.put(
        f"{settings.API_V1_STR}/sections/{uuid.uuid4()}",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Section not found"


def test_delete_section(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    section = create_random_section(db)
    user = User(
        email="section.user@example.com",
        hashed_password="hash",
        section_id=section.id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    response = client.delete(
        f"{settings.API_V1_STR}/sections/{section.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["message"] == "Section deleted successfully"


def test_delete_section_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.delete(
        f"{settings.API_V1_STR}/sections/{uuid.uuid4()}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Section not found"