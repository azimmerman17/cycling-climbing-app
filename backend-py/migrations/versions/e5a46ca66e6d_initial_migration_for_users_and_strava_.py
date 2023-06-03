"""Initial migration for users and strava_users

Revision ID: e5a46ca66e6d
Revises: 
Create Date: 2023-06-02 20:34:04.397397

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e5a46ca66e6d'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('strava__user',
    sa.Column('strava_id', sa.Integer(), nullable=False),
    sa.Column('bio', sa.String(), nullable=True),
    sa.Column('city', sa.String(), nullable=True),
    sa.Column('state', sa.String(), nullable=True),
    sa.Column('country', sa.String(), nullable=True),
    sa.Column('first_name', sa.String(), nullable=True),
    sa.Column('last_name', sa.String(), nullable=True),
    sa.Column('premium', sa.Boolean(), nullable=True),
    sa.Column('profile_pic', sa.String(), nullable=True),
    sa.Column('profile_pic_meduim', sa.String(), nullable=True),
    sa.Column('sex', sa.String(), nullable=True),
    sa.Column('username', sa.String(), nullable=True),
    sa.Column('weight', sa.Integer(), nullable=True),
    sa.Column('strava_access_token', sa.String(), nullable=True),
    sa.Column('strava_refresh_token', sa.String(), nullable=True),
    sa.Column('strava_token_type', sa.String(), nullable=True),
    sa.Column('strava_token_expires', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.String(), nullable=True),
    sa.Column('created_at', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('strava_id')
    )
    op.create_table('user',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('strava_id', sa.Integer(), nullable=True),
    sa.Column('first_name', sa.String(length=20), nullable=False),
    sa.Column('last_name', sa.String(length=20), nullable=False),
    sa.Column('email', sa.String(length=40), nullable=True),
    sa.Column('sex', sa.Enum('Male', 'Female', 'N/A', name='sex_types'), nullable=False),
    sa.Column('weight', sa.Float(), nullable=True),
    sa.Column('height', sa.Float(), nullable=True),
    sa.Column('ftp', sa.Integer(), nullable=True),
    sa.Column('password_digest', sa.String(), nullable=True),
    sa.Column('prefer_units', sa.Enum('Imperial', 'Metric', name='units_measurements'), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('user_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user')
    op.drop_table('strava__user')
    # ### end Alembic commands ###
