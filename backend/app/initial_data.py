import logging

from sqlmodel import Session, select

from app.core.db import engine, init_db
from app.core.security import get_password_hash
from app.models import Activity, ActivitySection, Section, Submission, User

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def seed_activities() -> None:
    with Session(engine) as session:
        init_db(session)

        existing_activities = session.exec(select(Activity)).all()
        if existing_activities:
            logger.info(
                "Database already contains %s activities. Skipping seeding.",
                len(existing_activities),
            )
            return

        section_a = Section(name="Section A")
        section_b = Section(name="Section B")
        session.add(section_a)
        session.add(section_b)
        session.commit()
        session.refresh(section_a)
        session.refresh(section_b)

        john = User(
            full_name="John Doe",
            email="john.doe@example.com",
            hashed_password=get_password_hash("password123"),
            section_id=section_a.id,
        )
        jane = User(
            full_name="Jane Smith",
            email="jane.smith@example.com",
            hashed_password=get_password_hash("password123"),
            section_id=section_b.id,
        )
        session.add(john)
        session.add(jane)
        session.commit()
        session.refresh(john)
        session.refresh(jane)

        activities = [
            Activity(
                activity_title="Math Assignment 1",
                description=(
                    "Complete all exercises from chapter 3. Focus on quadratic "
                    "equations and polynomial functions."
                ),
                deadline="2026-05-28",
                is_active=True,
            ),
            Activity(
                activity_title="English Essay",
                description=(
                    "Write a 2000-word essay on Shakespeare's influence on modern "
                    "literature. Include at least 5 scholarly sources."
                ),
                deadline="2026-05-30",
                is_active=True,
            ),
            Activity(
                activity_title="Science Project",
                description=(
                    "Create a presentation on renewable energy sources. Include "
                    "data analysis and recommendations."
                ),
                deadline="2026-06-05",
                is_active=True,
            ),
            Activity(
                activity_title="History Research Paper",
                description=(
                    "Research and write about the impact of the Industrial "
                    "Revolution on society."
                ),
                deadline="2026-05-29",
                is_active=True,
            ),
            Activity(
                activity_title="Chemistry Lab Report",
                description=(
                    "Complete the acid-base titration lab and submit your report "
                    "with calculations."
                ),
                deadline="2026-06-01",
                is_active=True,
            ),
        ]

        for activity in activities:
            session.add(activity)

        session.commit()

        session.add_all(
            [
                ActivitySection(activity_id=activities[0].id, section_id=section_a.id),
                ActivitySection(activity_id=activities[1].id, section_id=section_a.id),
                ActivitySection(activity_id=activities[2].id, section_id=section_a.id),
                ActivitySection(activity_id=activities[3].id, section_id=section_b.id),
                ActivitySection(activity_id=activities[4].id, section_id=section_b.id),
            ]
        )

        session.commit()
        # Add sample submissions for seeded users
        # John submits the first activity, Jane submits the fourth
        submission_1 = Submission(
            text="John's submission text...",
            user_id=john.id,
            activity_id=activities[0].id,
            prediction="Human",
            ai_probability=5.0,
        )
        submission_2 = Submission(
            text="Jane's submission text...",
            user_id=jane.id,
            activity_id=activities[3].id,
            prediction="AI",
            ai_probability=92.3,
        )
        session.add_all([submission_1, submission_2])
        session.commit()
        logger.info(
            "Successfully seeded %s activities, 2 sections, and 2 users into the database.",
            len(activities),
        )


def main() -> None:
    logger.info("Creating initial data")
    seed_activities()
    logger.info("Initial data created")


if __name__ == "__main__":
    main()
