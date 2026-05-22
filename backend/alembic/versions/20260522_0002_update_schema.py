"""update schema: remove student_name from activity, add section and activity_section, add section_id to student

Revision ID: 20260522_0002
Revises: 20260522_0001
Create Date: 2026-05-22 00:10:00.000000
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "20260522_0002"
down_revision = "20260522_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create section table
    op.create_table(
        "section",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("name", sa.String(), nullable=False),
    )

    # Create activity_section linking table
    op.create_table(
        "activity_section",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("activity_id", sa.Integer(), nullable=False),
        sa.Column("section_id", sa.Integer(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.ForeignKeyConstraint(["activity_id"], ["activity.id"]),
        sa.ForeignKeyConstraint(["section_id"], ["section.id"]),
    )

    # Add section_id to student
    op.add_column("student", sa.Column("section_id", sa.Integer(), nullable=True))
    op.create_foreign_key("fk_student_section", "student", "section", ["section_id"], ["id"])

    # Remove student_name from activity
    with op.batch_alter_table("activity") as batch_op:
        batch_op.drop_column("student_name")


def downgrade() -> None:
    # Add student_name back to activity
    with op.batch_alter_table("activity") as batch_op:
        batch_op.add_column(sa.Column("student_name", sa.String(), nullable=True))

    # Drop fk and column from student
    op.drop_constraint("fk_student_section", "student", type_="foreignkey")
    op.drop_column("student", "section_id")

    # Drop activity_section and section tables
    op.drop_table("activity_section")
    op.drop_table("section")
