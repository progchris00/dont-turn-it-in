"""Add section and activity section

Revision ID: 6d4c7d9a1b21
Revises: b7c9d1e4f2a0
Create Date: 2026-05-23 00:00:00.000000

"""
import sqlalchemy as sa
import sqlmodel.sql.sqltypes
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "6d4c7d9a1b21"
down_revision = "b7c9d1e4f2a0"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "section",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.add_column(
        "user",
        sa.Column("section_id", postgresql.UUID(as_uuid=True), nullable=True),
    )
    op.create_foreign_key(
        "user_section_id_fkey",
        "user",
        "section",
        ["section_id"],
        ["id"],
    )
    op.create_table(
        "activity_section",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("activity_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("section_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(["activity_id"], ["activity.id"]),
        sa.ForeignKeyConstraint(["section_id"], ["section.id"]),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade():
    op.drop_table("activity_section")
    op.drop_constraint("user_section_id_fkey", "user", type_="foreignkey")
    op.drop_column("user", "section_id")
    op.drop_table("section")