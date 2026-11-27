from collections.abc import Awaitable, Callable

from app.db.session import probe_database

DatabaseProbe = Callable[[], Awaitable[None]]


def get_database_probe() -> DatabaseProbe:
    return probe_database
