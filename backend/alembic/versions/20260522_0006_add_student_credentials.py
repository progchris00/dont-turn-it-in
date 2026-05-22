"""add username and password_hash to student

Revision ID: 20260522_0006
Revises: 20260522_0005
Create Date: 2026-05-22 23:20:00.000000
"""

from alembic import op
import sqlalchemy as sa
from passlib.context import CryptContext


# revision identifiers, used by Alembic.
revision = "20260522_0006"
down_revision = "20260522_0005"
branch_labels = None
depends_on = None


pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
DEFAULT_PASSWORD = "password123"


def upgrade() -> None:
    op.add_column("student", sa.Column("username", sa.String(), nullable=True))
    op.add_column("student", sa.Column("password_hash", sa.String(), nullable=True))

    bind = op.get_bind()
    rows = bind.execute(sa.text("SELECT id, student_name FROM student")).fetchall()
    for row in rows:
        username = row.student_name.lower().replace(" ", ".")
        password_hash = pwd_context.hash(DEFAULT_PASSWORD)
        bind.execute(
            sa.text(
                """
                UPDATE student
                SET username = :username,
                    password_hash = :password_hash
                WHERE id = :id
                """
            ),
            {"username": username, "password_hash": password_hash, "id": row.id},
        )

    op.alter_column("student", "username", nullable=False)
    op.alter_column("student", "password_hash", nullable=False)
    op.create_index("ix_student_username", "student", ["username"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_student_username", table_name="student")
    op.drop_column("student", "password_hash")
    op.drop_column("student", "username")