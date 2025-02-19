"""add observer and field_creation_date columns

Revision ID: 798596cc8262
Revises: 9ff769188d93
Create Date: 2025-02-17 15:08:45.167210

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "798596cc8262"
down_revision = "9ff769188d93"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        table_name="t_zh",
        column=sa.Column("observer", sa.String(255), nullable=False, server_default=""),
        schema="pr_zh",
    )

    op.add_column(
        table_name="t_zh",
        column=sa.Column(
            "field_creation_date", sa.DateTime, nullable=False, server_default="1900-01-01"
        ),
        schema="pr_zh",
    )


def downgrade():
    op.drop_column(table_name="t_zh", column_name="observer", schema="pr_zh")
    op.drop_column(table_name="t_zh", column_name="field_creation_date", schema="pr_zh")
