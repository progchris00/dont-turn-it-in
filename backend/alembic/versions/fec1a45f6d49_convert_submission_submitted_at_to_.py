"""convert submission.submitted_at to timestamptz

Revision ID: fec1a45f6d49
Revises: 20260522_0002
Create Date: 2026-05-22 21:33:10.457600
"""
from alembic import op
import sqlalchemy as sa



# revision identifiers, used by Alembic.
revision = 'fec1a45f6d49'
down_revision = '20260522_0002'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Add a new timestamptz column, backfill from the old string column,
    # then drop the old column and rename the new one to `submitted_at`.
    op.add_column('submission', sa.Column('submitted_at_ts', sa.TIMESTAMP(timezone=True), nullable=True))

    # Backfill from the existing string column (assumes ISO 8601 strings).
    op.execute("""
    UPDATE submission
    SET submitted_at_ts = submitted_at::timestamptz
    WHERE submitted_at IS NOT NULL;
    """)

    # Drop the old string column and rename the new column.
    with op.batch_alter_table('submission') as batch_op:
        batch_op.drop_column('submitted_at')
        batch_op.alter_column('submitted_at_ts', new_column_name='submitted_at')


def downgrade() -> None:
    # Reverse the upgrade: create a string column from the timestamptz value.
    op.add_column('submission', sa.Column('submitted_at_str', sa.String(), nullable=True))
    op.execute("""
    UPDATE submission
    SET submitted_at_str = submitted_at::text
    WHERE submitted_at IS NOT NULL;
    """)

    with op.batch_alter_table('submission') as batch_op:
        batch_op.drop_column('submitted_at')
        batch_op.alter_column('submitted_at_str', new_column_name='submitted_at')
