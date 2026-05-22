"""initial schema

Revision ID: 20260522_0001
Revises: 
Create Date: 2026-05-22 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "20260522_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "student",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("student_name", sa.String(), nullable=False),
    )

    op.create_table(
        "activity",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("student_name", sa.String(), nullable=False),
        sa.Column("activity_title", sa.String(), nullable=False),
        sa.Column("description", sa.String(), nullable=False),
        sa.Column("deadline", sa.String(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
    )

    op.create_table(
        "submission",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("text", sa.String(), nullable=False),
        sa.Column("student_id", sa.Integer(), nullable=True),
        sa.Column("activity_id", sa.Integer(), nullable=True),
        sa.Column("submitted_at", sa.String(), nullable=False),
        sa.Column("aiflag", sa.String(), nullable=True),
        sa.Column("ai_percent", sa.Float(), nullable=True),
        sa.Column("prediction", sa.String(), nullable=False, server_default=""),
        sa.Column("ai_probability", sa.Float(), nullable=False, server_default="0"),
        sa.ForeignKeyConstraint(["student_id"], ["student.id"]),
        sa.ForeignKeyConstraint(["activity_id"], ["activity.id"]),
    )


def downgrade() -> None:
    op.drop_table("submission")
    op.drop_table("activity")
    op.drop_table("student")
