import logging

from sqlmodel import Session, select

from app.core.db import engine, init_db
from app.core.security import get_password_hash
from app.models import Activity, ActivitySection, Section, Submission, User

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Student seed data

STUDENTS_SECTION_A = [
    {"full_name": "Marivic Austin S. Palma",  "email": "marivic.palma@school.edu.ph"},
    {"full_name": "Isabella Marie Garcia",     "email": "isabella.garcia@school.edu.ph"},
    {"full_name": "Sophia Anne Martinez",      "email": "sophia.martinez@school.edu.ph"},
    {"full_name": "Liam Jose Reyes",           "email": "liam.reyes@school.edu.ph"},
    {"full_name": "Chloe Mae Nguyen",          "email": "chloe.nguyen@school.edu.ph"},
    {"full_name": "Marcus Gabriel Webb",       "email": "marcus.webb@school.edu.ph"},
    {"full_name": "Priya Santos Sharma",       "email": "priya.sharma@school.edu.ph"},
    {"full_name": "Jordan Luis Kim",           "email": "jordan.kim@school.edu.ph"},
    {"full_name": "Angelica Rose Dela Cruz",   "email": "angelica.delacruz@school.edu.ph"},
]

STUDENTS_SECTION_B = [
    {"full_name": "Miguel Antonio Ramos",      "email": "miguel.ramos@school.edu.ph"},
    {"full_name": "Hannah Bianca Villanueva",  "email": "hannah.villanueva@school.edu.ph"},
    {"full_name": "Rafael Jose Mendoza",       "email": "rafael.mendoza@school.edu.ph"},
    {"full_name": "Katrina Louise Bautista",   "email": "katrina.bautista@school.edu.ph"},
    {"full_name": "Paolo Andres Fernandez",    "email": "paolo.fernandez@school.edu.ph"},
    {"full_name": "Clarisse Joy Domingo",      "email": "clarisse.domingo@school.edu.ph"},
    {"full_name": "Nathan Elias Aquino",       "email": "nathan.aquino@school.edu.ph"},
    {"full_name": "Trisha Nicole Castillo",    "email": "trisha.castillo@school.edu.ph"},
    {"full_name": "Enzo Rafael Magno",         "email": "enzo.magno@school.edu.ph"},
]


def seed_students(
    session: Session,
    section_a: Section,
    section_b: Section,
) -> list[User]:
    """
    Insert all dummy student users into the database.
    Returns the list of newly created User instances (not yet committed).
    The caller is responsible for calling session.commit() and session.refresh().
    Skips any student whose email already exists.
    """

    student_password = get_password_hash("student123")

    existing_emails = {u.email for u in session.exec(select(User)).all()}

    all_student_data = [
        (data, section_a) for data in STUDENTS_SECTION_A
    ] + [
        (data, section_b) for data in STUDENTS_SECTION_B
    ]

    new_users: list[User] = []

    for data, section in all_student_data:
        if data["email"] in existing_emails:
            logger.info("Student %s already exists — skipping.", data["email"])
            continue

        student = User(
            full_name=data["full_name"],
            email=data["email"],
            hashed_password=student_password,
            section_id=section.id,
        )
        session.add(student)
        new_users.append(student)

    return new_users


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

        students = seed_students(session, section_a, section_b)

        session.commit()
        session.refresh(john)
        session.refresh(jane)
        for student in students:
            session.refresh(student)

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
            "Successfully seeded %s activities, 2 sections, and %s users into the database.",
            len(activities),
            len(students) + 2,
        )


def main() -> None:
    logger.info("Creating initial data")
    seed_activities()
    logger.info("Initial data created")


if __name__ == "__main__":
    main()
