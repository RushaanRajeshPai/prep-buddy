"""Opt-in test against the configured local PostgreSQL database; no writes."""

import os

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.mark.skipif(
    os.getenv("RUN_DATABASE_TESTS") != "1",
    reason="Requires configured local PostgreSQL",
)
def test_real_database_readiness():
    with TestClient(app) as client:
        response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["database"] == "connected"
