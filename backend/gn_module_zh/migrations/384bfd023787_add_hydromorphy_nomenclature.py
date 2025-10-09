"""add hydromorphy nomenclature

Revision ID: 384bfd023787
Revises: ea0eefb3744a
Create Date: 2025-05-05 11:58:01.439596

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "384bfd023787"
down_revision = "9ff769188d93"
branch_labels = None
depends_on = None


def upgrade():

    op.execute(
        """
        SELECT setval(
            'ref_nomenclatures.bib_nomenclatures_types_id_type_seq',
            (SELECT MAX(id_type) FROM ref_nomenclatures.bib_nomenclatures_types),
            true
        );
    """
    )

    op.execute(
        """
        SELECT setval(
            'ref_nomenclatures.t_nomenclatures_id_nomenclature_seq',
            (SELECT MAX(id_nomenclature) FROM ref_nomenclatures.t_nomenclatures),
            true
        );
    """
    )

    op.execute(
        """
        INSERT INTO ref_nomenclatures.bib_nomenclatures_types(mnemonique, label_default, definition_default, label_fr, definition_fr, source, statut)
        VALUES ('HYDROMORPHY', 'Trace d''hydromorphie caractéristique de la ZH', 'Trace d''hydromorphie caractéristique de la ZH', 'Trace d''hydromorphie caractéristique de la ZH', 'Trace d''hydromorphie caractéristique de la ZH', 'ZONES_HUMIDES', 'Non validé');
    """
    )

    op.execute(
        """
        INSERT INTO ref_nomenclatures.t_nomenclatures(id_type, cd_nomenclature, mnemonique, label_default, definition_default, label_fr, definition_fr, source, statut)
        VALUES 
            (
                (SELECT id_type FROM ref_nomenclatures.bib_nomenclatures_types WHERE mnemonique = 'HYDROMORPHY'),
                '1',
                'Horizons histiques (ou tourbeux) débutant à moins de 50 cm de la surface du sol et d''une épaisseur d''au moins 50 cm',
                'Horizons histiques (ou tourbeux) débutant à moins de 50 cm de la surface du sol et d''une épaisseur d''au moins 50 cm',
                'Horizons histiques (ou tourbeux) débutant à moins de 50 cm de la surface du sol et d''une épaisseur d''au moins 50 cm',
                'Horizons histiques (ou tourbeux) débutant à moins de 50 cm de la surface du sol et d''une épaisseur d''au moins 50 cm',
                'Horizons histiques (ou tourbeux) débutant à moins de 50 cm de la surface du sol et d''une épaisseur d''au moins 50 cm',
                'ZONES_HUMIDES',
                'NON VALIDÉ'
            ),
                           (
                (SELECT id_type FROM ref_nomenclatures.bib_nomenclatures_types WHERE mnemonique = 'HYDROMORPHY'),
                '2',
                'Traits reductiques débutant à moins de 50 cm de la surface du sol',
                'Traits reductiques débutant à moins de 50 cm de la surface du sol',
                'Traits reductiques débutant à moins de 50 cm de la surface du sol',
                'Traits reductiques débutant à moins de 50 cm de la surface du sol',
                'Traits reductiques débutant à moins de 50 cm de la surface du sol',
                'ZONES_HUMIDES',
                'NON VALIDÉ'
            ),
                           (
                (SELECT id_type FROM ref_nomenclatures.bib_nomenclatures_types WHERE mnemonique = 'HYDROMORPHY'),
                '3',
                'Traits rédoxiques débutant à moins de 25 cm de profondeur dans le sol et se prolongeant ou s''intensifiant en profondeur',
                'Traits rédoxiques débutant à moins de 25 cm de profondeur dans le sol et se prolongeant ou s''intensifiant en profondeur',
                'Traits rédoxiques débutant à moins de 25 cm de profondeur dans le sol et se prolongeant ou s''intensifiant en profondeur',
                'Traits rédoxiques débutant à moins de 25 cm de profondeur dans le sol et se prolongeant ou s''intensifiant en profondeur',
                'Traits rédoxiques débutant à moins de 25 cm de profondeur dans le sol et se prolongeant ou s''intensifiant en profondeur',
                'ZONES_HUMIDES',
                'NON VALIDÉ'
            ),
                           (
                (SELECT id_type FROM ref_nomenclatures.bib_nomenclatures_types WHERE mnemonique = 'HYDROMORPHY'),
                '4',
                'Traits rédoxiques débutant à moins de 50 cm de profondeur dans le sol et se prolongeant ou s''intensifiant en profondeur et traits reductiques apparaissant entre 80 cm et 120 cm de profondeur',
                'Traits rédoxiques débutant à moins de 50 cm de profondeur dans le sol et se prolongeant ou s''intensifiant en profondeur et traits reductiques apparaissant entre 80 cm et 120 cm de profondeur',
                'Traits rédoxiques débutant à moins de 50 cm de profondeur dans le sol et se prolongeant ou s''intensifiant en profondeur et traits reductiques apparaissant entre 80 cm et 120 cm de profondeur',
                'Traits rédoxiques débutant à moins de 50 cm de profondeur dans le sol et se prolongeant ou s''intensifiant en profondeur et traits reductiques apparaissant entre 80 cm et 120 cm de profondeur',
                'Traits rédoxiques débutant à moins de 50 cm de profondeur dans le sol et se prolongeant ou s''intensifiant en profondeur et traits reductiques apparaissant entre 80 cm et 120 cm de profondeur',
                'ZONES_HUMIDES',
                'NON VALIDÉ'
            ),
                           (
                (SELECT id_type FROM ref_nomenclatures.bib_nomenclatures_types WHERE mnemonique = 'HYDROMORPHY'),
                '5',
                'Cas particuliers',
                'Cas particuliers',
                'Cas particuliers',
                'Cas particuliers',
                'Cas particuliers',
                'ZONES_HUMIDES',
                'NON VALIDÉ'
            );
    """
    )


def downgrade():
    op.execute(
        """
        DELETE FROM ref_nomenclatures.t_nomenclatures
        WHERE id_type = (SELECT id_type FROM ref_nomenclatures.bib_nomenclatures_types WHERE mnemonique = 'HYDROMORPHY')
    """
    )

    op.execute(
        """
        DELETE FROM ref_nomenclatures.bib_nomenclatures_types
        WHERE mnemonique = 'HYDROMORPHY' AND source = 'ZONES_HUMIDES';
    """
    )
