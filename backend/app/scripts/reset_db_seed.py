from alembic import command
from alembic.config import Config
from sqlmodel import SQLModel

from app.database import engine
from app.seeders.activity_seeder import seed_activities

# Import models so their tables are registered on SQLModel.metadata
from app.models import activity  # noqa: F401
from app.models import student  # noqa: F401
from app.models import submission  # noqa: F401


def reset_and_seed() -> None:
    # Force-drop known tables with CASCADE to avoid dependency ordering issues
    tables_to_drop = [
        "activity_section",
        "activitysection",
        "activity",
        "submission",
        "student",
        "section",
        "alembic_version",
    ]

    import sqlalchemy as sa

    with engine.begin() as conn:
        for t in tables_to_drop:
            try:
                conn.execute(sa.text(f"DROP TABLE IF EXISTS {t} CASCADE"))
            except Exception:
                # best-effort; continue on error
                pass

    # Apply migrations from Alembic
    alembic_cfg = Config("alembic.ini")
    # Ensure Alembic thinks the DB is at the base so all migrations are applied
    command.stamp(alembic_cfg, "base")
    command.upgrade(alembic_cfg, "head")

    # Seed initial data
    seed_activities()


if __name__ == "__main__":
    reset_and_seed()
