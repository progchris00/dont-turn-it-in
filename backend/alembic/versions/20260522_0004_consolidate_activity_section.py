"""consolidate activity section table names

Revision ID: 20260522_0004
Revises: 20260522_0003
Create Date: 2026-05-22 22:00:00.000000
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "20260522_0004"
down_revision = "20260522_0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    tables = inspector.get_table_names()

    # If only the legacy 'activitysection' exists, rename it to the canonical name.
    if "activitysection" in tables and "activity_section" not in tables:
        op.rename_table("activitysection", "activity_section")
        return

    # If both exist, copy any missing rows and drop the legacy table.
    if "activitysection" in tables and "activity_section" in tables:
        # Copy rows that don't already exist in activity_section
        op.execute(
            """
            INSERT INTO activity_section (activity_id, section_id, is_active)
            SELECT activity_id, section_id, is_active FROM activitysection a
            WHERE NOT EXISTS (
                SELECT 1 FROM activity_section b
                WHERE b.activity_id = a.activity_id AND b.section_id = a.section_id
            );
            """
        )
        op.drop_table("activitysection")


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    tables = inspector.get_table_names()

    # On downgrade, if only the canonical exists, rename it back to legacy.
    if "activity_section" in tables and "activitysection" not in tables:
        op.rename_table("activity_section", "activitysection")
        return

    # If both exist (unlikely), recreate legacy from canonical
    if "activity_section" in tables and "activitysection" in tables:
        op.execute(
            """
            INSERT INTO activitysection (activity_id, section_id, is_active)
            SELECT activity_id, section_id, is_active FROM activity_section a
            WHERE NOT EXISTS (
                SELECT 1 FROM activitysection b
                WHERE b.activity_id = a.activity_id AND b.section_id = a.section_id
            );
            """
        )