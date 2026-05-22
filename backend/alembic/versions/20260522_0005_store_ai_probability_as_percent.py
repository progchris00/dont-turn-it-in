"""store submission ai_probability as percent

Revision ID: 20260522_0005
Revises: 20260522_0004
Create Date: 2026-05-22 23:10:00.000000
"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "20260522_0005"
down_revision = "20260522_0004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Backfill only rows still stored as 0-1 probabilities.
    op.execute(
        """
        UPDATE submission
        SET ai_probability = ai_probability * 100
        WHERE ai_probability IS NOT NULL AND ai_probability <= 1.0;
        """
    )


def downgrade() -> None:
    op.execute(
        """
        UPDATE submission
        SET ai_probability = ai_probability / 100
        WHERE ai_probability IS NOT NULL AND ai_probability > 1.0;
        """
    )