from fastapi.testclient import TestClient
from sqlalchemy.exc import OperationalError

from app.api.dependencies import get_database_probe
from app.main import create_app


def test_health_checks_the_database():
    calls = []

    async def healthy_database():
        calls.append(True)

    app = create_app()
    app.dependency_overrides[get_database_probe] = lambda: healthy_database
    with TestClient(app) as client:
        response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "PrepBuddy",
        "database": "connected",
    }
    assert calls == [True]


def test_database_failure_is_safe_and_not_reported_as_healthy():
    async def broken_database():
        raise OperationalError(
            "SELECT 1", {}, RuntimeError("sensitive connection detail")
        )

    app = create_app()
    app.dependency_overrides[get_database_probe] = lambda: broken_database
    with TestClient(app) as client:
        response = client.get("/api/v1/health")
    assert response.status_code == 503
    assert response.json() == {"detail": "Database unavailable"}
    assert "sensitive" not in response.text
