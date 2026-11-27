import pytest
from fastapi.testclient import TestClient

from app.main import create_app


@pytest.mark.parametrize(
    "payload",
    [
        {"name": "A", "email": "person@example.com", "password": "password123"},
        {"name": "Person", "email": "invalid", "password": "password123"},
        {"name": "Person", "email": "person@example.com", "password": "short"},
        {"name": "Person", "email": "person@example.com", "password": "x" * 129},
        {"name": "x" * 81, "email": "person@example.com", "password": "password123"},
    ],
)
def test_registration_validates_input(payload):
    with TestClient(create_app()) as client:
        response = client.post(
            "/api/v1/auth/register", json=payload, headers={"Origin": "http://localhost:3000"}
        )
    assert response.status_code == 422
    assert "password123" not in response.text


@pytest.mark.parametrize(
    "origin", [None, "null", "https://evil.example", "http://localhost:3000.evil.example"]
)
@pytest.mark.parametrize("route", ["register", "login", "logout"])
def test_post_requires_explicit_trusted_origin(origin, route):
    with TestClient(create_app()) as client:
        response = client.post(
            f"/api/v1/auth/{route}",
            json={},
            headers={"Origin": origin} if origin is not None else {},
        )
    assert response.status_code == 403


def test_auth_rate_limit_is_bounded_and_does_not_trust_forwarded_ip():
    with TestClient(create_app()) as client:
        for index in range(10):
            response = client.post(
                "/api/v1/auth/login",
                json={},
                headers={
                    "Origin": "http://localhost:3000",
                    "X-Forwarded-For": f"192.0.2.{index}",
                },
            )
            assert response.status_code == 422
        response = client.post(
            "/api/v1/auth/login", json={}, headers={"Origin": "http://localhost:3000"}
        )
        assert response.status_code == 429
        assert response.headers["retry-after"] == "60"


def test_cors_allows_credentials_only_for_exact_origins():
    with TestClient(create_app()) as client:
        response = client.options(
            "/api/v1/auth/login",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type",
            },
        )
        assert response.status_code == 200
        assert response.headers["access-control-allow-credentials"] == "true"
        assert response.headers["access-control-allow-origin"] == "http://localhost:3000"
        bad = client.options(
            "/api/v1/auth/login",
            headers={
                "Origin": "https://evil.example",
                "Access-Control-Request-Method": "POST",
            },
        )
        assert "access-control-allow-origin" not in bad.headers


def test_invalid_password_is_not_echoed_in_validation_errors():
    with TestClient(create_app()) as client:
        response = client.post(
            "/api/v1/auth/register",
            json={
                "name": "Person",
                "email": "person@example.com",
                "password": "secret",
            },
            headers={"Origin": "http://localhost:3000"},
        )
    assert response.status_code == 422
    assert "secret" not in response.text


def test_password_hashing_is_salted_and_checks_passwords():
    from app.core.security import hash_password, verify_password

    first = hash_password("test-password-123")
    second = hash_password("test-password-123")
    assert first.startswith("$argon2id$") and first != second
    assert verify_password("test-password-123", first)
    assert not verify_password("wrong-password", first)
    assert not verify_password("test-password-123", "invalid-hash")


def test_rate_limit_memory_capacity_and_window_expiry():
    import asyncio

    from app.core.auth_guard import AuthGuardMiddleware

    now = [0.0]
    messages = []

    async def app(scope, receive, send):
        await send({"type": "http.response.start", "status": 204, "headers": []})

    async def send(message):
        messages.append(message)

    async def receive():
        return {"type": "http.request", "body": b""}

    guard = AuthGuardMiddleware(app, ["http://localhost:3000"], max_ips=2, clock=lambda: now[0])

    def attempt(ip):
        messages.clear()
        asyncio.run(
            guard(
                {
                    "type": "http",
                    "method": "POST",
                    "path": "/api/v1/auth/login",
                    "client": (ip, 123),
                    "headers": [(b"origin", b"http://localhost:3000")],
                },
                receive,
                send,
            )
        )
        return messages[0]["status"]

    assert attempt("ip-1") == attempt("ip-2") == 204
    assert attempt("ip-3") == 429
    assert len(guard.attempts) == 2
    for _ in range(9):
        assert attempt("ip-1") == 204
    assert attempt("ip-1") == 429
    now[0] = 60.0
    assert attempt("ip-3") == 204
    assert len(guard.attempts) == 1


def test_me_requires_authentication():
    with TestClient(create_app()) as client:
        response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
