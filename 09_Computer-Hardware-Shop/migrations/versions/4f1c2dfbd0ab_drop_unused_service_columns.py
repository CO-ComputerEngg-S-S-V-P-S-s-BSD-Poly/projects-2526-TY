"""drop unused service_request columns

Revision ID: 4f1c2dfbd0ab
Revises: 8eaf94753add
Create Date: 2026-03-09 14:15:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4f1c2dfbd0ab'
down_revision = '8eaf94753add'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('service_request', schema=None) as batch_op:
        batch_op.drop_column('completed_at')
        batch_op.drop_column('device_brand')


def downgrade():
    with op.batch_alter_table('service_request', schema=None) as batch_op:
        batch_op.add_column(sa.Column('device_brand', sa.String(length=50), nullable=True))
        batch_op.add_column(sa.Column('completed_at', sa.DateTime(), nullable=True))