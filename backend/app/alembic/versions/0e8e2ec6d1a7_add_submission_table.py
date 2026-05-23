"""Add submission table

Revision ID: 0e8e2ec6d1a7
Revises: 6d4c7d9a1b21
Create Date: 2026-05-23 00:00:00.000000

"""
import sqlalchemy as sa
import sqlmodel.sql.sqltypes
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "0e8e2ec6d1a7"
down_revision = "6d4c7d9a1b21"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "submission",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("text", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("activity_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("submitted_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("aiflag", sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column("prediction", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("ai_probability", sa.Float(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["user.id"]),
        sa.ForeignKeyConstraint(["activity_id"], ["activity.id"]),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade():
    op.drop_table("submission")