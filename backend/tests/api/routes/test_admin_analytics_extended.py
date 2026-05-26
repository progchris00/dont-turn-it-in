from fastapi.testclient import TestClient
from sqlmodel import Session, select

from app.core.config import settings
from app.models import Activity, ActivitySection, Section, Submission, User


def _seed_section_with_data(db: Session) -> Section:
    section = Section(name="Section A")
    db.add(section)
    db.commit()
    db.refresh(section)

    # Create admin user and attach to section.
    user = db.exec(select(User).where(User.email == settings.FIRST_SUPERUSER)).first()
    assert user is not None
    user.section_id = section.id
    db.add(user)
    db.commit()

    # Add two students.
    s1 = User(
        email="s1@example.com",
        full_name="Student One",
        hashed_password="x",
        section_id=section.id,
    )
    s2 = User(
        email="s2@example.com",
        full_name="Student Two",
        hashed_password="x",
        section_id=section.id,
    )
    db.add(s1)
    db.add(s2)
    db.commit()
    db.refresh(s1)
    db.refresh(s2)

    # Activities.
    a1 = Activity(
        activity_title="Activity 1",
        description="d",
        deadline="2026-06-01",
        is_active=True,
    )
    a2 = Activity(
        activity_title="Activity 2",
        description="d",
        deadline="2026-06-15",
        is_active=True,
    )
    db.add(a1)
    db.add(a2)
    db.commit()
    db.refresh(a1)
    db.refresh(a2)

    db.add(ActivitySection(activity_id=a1.id, section_id=section.id, is_active=True))
    db.add(ActivitySection(activity_id=a2.id, section_id=section.id, is_active=True))
    db.commit()

    # Submissions: s1 low, s2 high.
    db.add(
        Submission(
            text="t",
            user_id=s1.id,
            activity_id=a1.id,
            prediction="Human",
            ai_probability=10.0,
        )
    )
    db.add(
        Submission(
            text="t",
            user_id=s1.id,
            activity_id=a2.id,
            prediction="Human",
            ai_probability=15.0,
        )
    )
    db.add(
        Submission(
            text="t",
            user_id=s2.id,
            activity_id=a1.id,
            prediction="AI",
            ai_probability=60.0,
        )
    )
    db.add(
        Submission(
            text="t",
            user_id=s2.id,
            activity_id=a2.id,
            prediction="AI",
            ai_probability=70.0,
        )
    )
    db.commit()

    return section


def test_admin_analytics_all_endpoints(
    client: TestClient,
    superuser_token_headers: dict[str, str],
    db: Session,
) -> None:
    _seed_section_with_data(db)

    r1 = client.get(
        f"{settings.API_V1_STR}/admin/analytics/ai-distribution",
        headers=superuser_token_headers,
    )
    assert r1.status_code == 200
    payload = r1.json()
    assert "distribution" in payload
    assert len(payload["distribution"]) == 3

    r2 = client.get(
        f"{settings.API_V1_STR}/admin/analytics/student-forecast-line",
        headers=superuser_token_headers,
    )
    assert r2.status_code == 200
    payload2 = r2.json()
    assert "series" in payload2
    assert isinstance(payload2["series"], list)
    # At least 1 student point per student
    if payload2["series"]:
        assert "points" in payload2["series"][0]

    r3 = client.get(
        f"{settings.API_V1_STR}/admin/analytics/student-table",
        headers=superuser_token_headers,
    )
    assert r3.status_code == 200
    payload3 = r3.json()
    assert "rows" in payload3
    assert payload3["rows"] == [] or all(
        {
            "studentName",
            "riskScore",
            "riskLevel",
            "numSubmissions",
            "avgAiPercent",
            "predictiveFlag",
            "actionableRemark",
            "predictedAiPercent",
        }.issubset(row.keys())
        for row in payload3["rows"]
    )

