"""add hydromorphy column in t_zh table

Revision ID: c29905767494
Revises: 384bfd023787
Create Date: 2025-05-05 15:23:11.977050

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import Column, Integer, ForeignKey

# revision identifiers, used by Alembic.
revision = "c29905767494"
down_revision = "384bfd023787"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        schema="pr_zh",
        table_name="t_zh",
        column=Column(
            "id_hydromorphy",
            Integer,
            nullable=True,
        ),
    )

    op.create_foreign_key(
        constraint_name="fk_t_zh_t_nomenclatures_hydromorphy",
        source_table="t_zh",
        referent_table="t_nomenclatures",
        local_cols=["id_hydromorphy"],
        remote_cols=["id_nomenclature"],
        source_schema="pr_zh",
        referent_schema="ref_nomenclatures",
        onupdate="CASCADE",
    )


def downgrade():
    op.drop_column(
        schema="pr_zh",
        table_name="t_zh",
        column_name="id_hydromorphy",
    )
