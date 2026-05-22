from sqlmodel import Session, select, SQLModel
from app.database import engine
from app.auth import hash_password
from app.models.activity import Activity
from app.models.student import Student
from app.models.section import Section
from app.models.activity_section import ActivitySection


def seed_activities():
    """Seed the database with sample activities."""
    # Create tables if they don't exist
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        # Check if activities already exist
        statement = select(Activity)
        existing_activities = session.exec(statement).all()
        if len(existing_activities) > 0:
            print(f"Database already contains {len(existing_activities)} activities. Skipping seeding.")
            return

        # Create example sections
        section_a = Section(name="Section A")
        section_b = Section(name="Section B")
        session.add(section_a)
        session.add(section_b)
        session.commit()
        session.refresh(section_a)
        session.refresh(section_b)

        # Create example students and assign to sections
        john = Student(
            student_name="John Doe",
            username="john.doe",
            password_hash=hash_password("password123"),
            section_id=section_a.id,
        )
        jane = Student(
            student_name="Jane Smith",
            username="jane.smith",
            password_hash=hash_password("password123"),
            section_id=section_b.id,
        )
        session.add(john)
        session.add(jane)
        session.commit()
        session.refresh(john)
        session.refresh(jane)

        # Create activities
        activities = [
            Activity(
                activity_title="Math Assignment 1",
                description="Complete all exercises from chapter 3. Focus on quadratic equations and polynomial functions.",
                deadline="2026-05-28",
                is_active=True,
            ),
            Activity(
                activity_title="English Essay",
                description="Write a 2000-word essay on Shakespeare's influence on modern literature. Include at least 5 scholarly sources.",
                deadline="2026-05-30",
                is_active=True,
            ),
            Activity(
                activity_title="Science Project",
                description="Create a presentation on renewable energy sources. Include data analysis and recommendations.",
                deadline="2026-06-05",
                is_active=True,
            ),
            Activity(
                activity_title="History Research Paper",
                description="Research and write about the impact of the Industrial Revolution on society.",
                deadline="2026-05-29",
                is_active=True,
            ),
            Activity(
                activity_title="Chemistry Lab Report",
                description="Complete the acid-base titration lab and submit your report with calculations.",
                deadline="2026-06-01",
                is_active=True,
            ),
        ]

        for activity in activities:
            session.add(activity)

        session.commit()

        # Assign activities to sections
        # First three to Section A, others to Section B
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
        print(f"Successfully seeded {len(activities)} activities, 2 sections, and 2 students into the database.")


if __name__ == "__main__":
    seed_activities()
