"""add_cb_cover_percentage

Revision ID: 9ff769188d93
Revises: 76e89c793961
Create Date: 2024-07-04 15:42:25.691119

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "9ff769188d93"
down_revision = "76e89c793961"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        table_name="cor_zh_cb",
        column=sa.Column("cb_cover", sa.Integer, nullable=True),
        schema="pr_zh",
    )


def downgrade():
    op.drop_column(table_name="cor_zh_cb", column_name="cb_cover", schema="pr_zh")
