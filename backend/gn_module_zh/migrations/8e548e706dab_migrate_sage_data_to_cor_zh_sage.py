"""migrate sage data to cor_zh_sage

Revision ID: 8e548e706dab
Revises: 8171f2ed44e3
Create Date: 2025-09-25 09:14:39.983767

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import Column, Integer

# revision identifiers, used by Alembic.
revision = '8e548e706dab'
down_revision = '8171f2ed44e3'
branch_labels = None
depends_on = None


def upgrade():
    op.execute(
        """
            INSERT INTO pr_zh.cor_zh_sage
            SELECT id_zh, id_sage
            FROM pr_zh.t_zh
            WHERE id_sage IS NOT NULL
        """
    )

    op.drop_column(
        schema="pr_zh",
        table_name="t_zh",
        column_name="id_sage",
    )

def downgrade():
    op.add_column(
        schema="pr_zh",
        table_name="t_zh",
        column=Column(
            "id_sage",
            Integer,
            nullable=True,
        ),
    )

    op.create_foreign_key(
        constraint_name="fk_t_zh_sage_t_nomenclatures",
        source_table="t_zh",
        referent_table="t_nomenclatures",
        local_cols=["id_sage"],
        remote_cols=["id_nomenclature"],
        source_schema="pr_zh",
        referent_schema="ref_nomenclatures",
        onupdate="CASCADE",
    )

    op.execute(
        """
            UPDATE pr_zh.t_zh tzh
            SET id_sage = subquery.id_sage
            FROM (
                SELECT id_zh, id_sage
                FROM pr_zh.cor_zh_sage
                ) AS subquery
            WHERE tzh.id_zh = subquery.id_zh
        """
    )

    op.execute(
        """
            DELETE
            FROM pr_zh.cor_zh_sage
        """
    )
