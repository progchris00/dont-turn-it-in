from fastapi import status
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
    matching_submission = next(
        row
        for row in content
        if row["activityTitle"] == activity.activity_title
        and row["activityId"] == str(activity.id)
    )
    assert matching_submission["activityTitle"] == activity.activity_title
    assert matching_submission["activityId"] == str(activity.id)


def test_create_student_submission_allows_duplicate_activity(
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

    response = client.post(
        f"{settings.API_V1_STR}/submissions",
        headers=superuser_token_headers,
        data={"activity_id": str(activity.id)},
        files={"file": ("submission.txt", b"hello world", "text/plain")},
    )

    assert response.status_code == status.HTTP_200_OK

    submissions = db.exec(
        select(Submission).where(
            Submission.user_id == user.id,
            Submission.activity_id == activity.id,
        )
    ).all()
    assert len(submissions) == 2