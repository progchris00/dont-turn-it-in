"""drop ai_percent from submission

Revision ID: 20260522_0003
Revises: fec1a45f6d49
Create Date: 2026-05-22 21:40:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "20260522_0003"
down_revision = "fec1a45f6d49"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table('submission') as batch_op:
        batch_op.drop_column('ai_percent')


def downgrade() -> None:
    with op.batch_alter_table('submission') as batch_op:
        batch_op.add_column(sa.Column('ai_percent', sa.Float(), nullable=True))
