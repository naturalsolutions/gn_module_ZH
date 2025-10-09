"""create cor_zh_sage table

Revision ID: 8171f2ed44e3
Revises: c29905767494
Create Date: 2025-09-22 23:32:58.030339

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8171f2ed44e3'
down_revision = 'c29905767494'
branch_labels = None
depends_on = None


def upgrade():
    # Création de la table dans le schéma pr_zh
    op.create_table(
        "cor_zh_sage",
        sa.Column("id_zh", sa.Integer, nullable=False),
        sa.Column("id_sage", sa.Integer, nullable=False),
        sa.PrimaryKeyConstraint("id_zh", "id_sage", name="pk_cor_zh_sage"),
        schema="pr_zh",
    )

    # Ajout de la contrainte de clé étrangère
    op.create_foreign_key(
        constraint_name="fk_cor_zh_sage_t_zh_pr_zh",
        source_table="cor_zh_sage",
        referent_table="t_zh",
        local_cols=["id_zh"],
        remote_cols=["id_zh"],
        source_schema="pr_zh",
        referent_schema="pr_zh",
        onupdate="CASCADE",
        ondelete="CASCADE",
    )


def downgrade():
    op.drop_table("cor_zh_sage", schema="pr_zh")
