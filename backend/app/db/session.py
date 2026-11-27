from functools import lru_cache

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine

from app.core.config import get_settings


@lru_cache
def get_engine() -> AsyncEngine:
    return create_async_engine(
        get_settings().database_url,
        pool_pre_ping=True,
        connect_args={"connect_timeout": 5},
    )


async def get_db():
    async with AsyncSession(get_engine(), expire_on_commit=False) as session:
        yield session


async def probe_database() -> None:
    async with get_engine().connect() as connection:
        await connection.execute(text("SELECT 1"))
