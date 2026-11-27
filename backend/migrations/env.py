import asyncio

from alembic import context

from app.db.base import Base
from app.db.session import get_engine
from app.models.auth_session import AuthSession  # noqa: F401
from app.models.user import User  # noqa: F401


def run_migrations(connection):
    context.configure(connection=connection, target_metadata=Base.metadata, compare_type=True)
    with context.begin_transaction():
        context.run_migrations()


async def online():
    engine = get_engine()
    async with engine.connect() as connection:
        await connection.run_sync(run_migrations)
    await engine.dispose()


if context.is_offline_mode():
    # No URL (and no credentials) needed for reviewed PostgreSQL SQL output.
    context.configure(dialect_name="postgresql", target_metadata=Base.metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()
else:
    asyncio.run(online())
