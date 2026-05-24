from fastapi.testclient import TestClient
from sqlmodel import Session
from sqlmodel import select

from app.core.config import settings
from app.models import Activity, ActivitySection, Section, Submission, User


def test_admin_analytics_overview_and_student_table(
    client: TestClient,
    superuser_token_headers: dict[str, str],
    db: Session,
) -> None:
    section = Section(name="Section A")
    db.add(section)
    db.commit()
    db.refresh(section)

    # Superuser acts as admin; attach to section.
    user = db.exec(select(User).where(User.email == settings.FIRST_SUPERUSER)).first()
    assert user is not None
    user.section_id = section.id
    db.add(user)
    db.commit()

    # Add two students.
    s1 = User(email="s1@example.com", full_name="Student One", hashed_password="x", section_id=section.id)
    s2 = User(email="s2@example.com", full_name="Student Two", hashed_password="x", section_id=section.id)
    db.add(s1)
    db.add(s2)
    db.commit()
    db.refresh(s1)
    db.refresh(s2)

    # Activities.
    a1 = Activity(activity_title="Activity 1", description="d", deadline="2026-06-01", is_active=True)
    a2 = Activity(activity_title="Activity 2", description="d", deadline="2026-06-15", is_active=True)
    db.add(a1)
    db.add(a2)
    db.commit()
    db.refresh(a1)
    db.refresh(a2)

    db.add(ActivitySection(activity_id=a1.id, section_id=section.id, is_active=True))
    db.add(ActivitySection(activity_id=a2.id, section_id=section.id, is_active=True))
    db.commit()

    # Submissions: s1 low, s2 high.
    db.add(Submission(text="t", user_id=s1.id, activity_id=a1.id, prediction="Human", ai_probability=10.0))
    db.add(Submission(text="t", user_id=s1.id, activity_id=a2.id, prediction="Human", ai_probability=15.0))
    db.add(Submission(text="t", user_id=s2.id, activity_id=a1.id, prediction="AI", ai_probability=60.0))
    db.add(Submission(text="t", user_id=s2.id, activity_id=a2.id, prediction="AI", ai_probability=70.0))
    db.commit()

    r = client.get(
        f"{settings.API_V1_STR}/admin/analytics/overview",
        headers=superuser_token_headers,
    )
    assert r.status_code == 200
    payload = r.json()
    assert payload["num_students"] == 3  # includes admin user + 2 students

    r2 = client.get(
        f"{settings.API_V1_STR}/admin/analytics/student-table",
        headers=superuser_token_headers,
    )
    assert r2.status_code == 200
    table = r2.json()
    assert "rows" in table
    # Ensure student rows include expected keys.
    assert any("studentName" in row for row in table["rows"]) 

