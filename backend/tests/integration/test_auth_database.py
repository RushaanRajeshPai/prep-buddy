"""Opt-in local PostgreSQL auth flow. Only unique synthetic accounts are removed."""

import asyncio
import os
import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text

from app.db.session import get_engine
from app.main import create_app


@pytest.mark.skipif(
    os.getenv("RUN_DATABASE_TESTS") != "1", reason="Requires local PostgreSQL"
)
def test_registration_session_login_logout():
    email = f"auth-test-{uuid.uuid4().hex}@example.com"
    password = "Synthetic-password-123"
    origin = {"Origin": "http://localhost:3000"}
    app = create_app()
    try:
        with TestClient(app, base_url="https://testserver") as client:
            result = client.post(
                "/api/v1/auth/register",
                json={
                    "name": " Test Person ",
                    "email": email.upper(),
                    "password": password,
                },
                headers=origin,
            )
            assert result.status_code == 201
            user = result.json()["user"]
            assert set(user) == {"id", "name", "email"}
            assert user["email"] == email
            assert user["name"] == "Test Person"
            uuid.UUID(user["id"])
            cookie = result.headers["set-cookie"]
            assert "HttpOnly" in cookie and "SameSite=lax" in cookie
            assert (
                "Max-Age=604800" in cookie
                and "Path=/" in cookie
                and "expires=" in cookie
            )
            token = client.cookies.get("prepbuddy_session")
            assert token and client.get("/api/v1/auth/me").json() == {"user": user}
            duplicate = client.post(
                "/api/v1/auth/register",
                json={
                    "name": "Someone Else",
                    "email": email,
                    "password": password,
                },
                headers=origin,
            )
            assert duplicate.status_code == 409
            assert client.post("/api/v1/auth/logout", headers=origin).json() == {
                "message": "Logged out"
            }
            assert client.get("/api/v1/auth/me").status_code == 401
            client.cookies.set("prepbuddy_session", token)
            assert client.get("/api/v1/auth/me").status_code == 401
            client.cookies.clear()
            wrong = client.post(
                "/api/v1/auth/login",
                json={"email": email, "password": "Wrong-password"},
                headers=origin,
            )
            assert wrong.status_code == 401
            missing = client.post(
                "/api/v1/auth/login",
                json={
                    "email": f"missing-{uuid.uuid4().hex}@example.com",
                    "password": password,
                },
                headers=origin,
            )
            assert missing.status_code == 401 and missing.json() == wrong.json()
            login = client.post(
                "/api/v1/auth/login",
                json={"email": email.upper(), "password": password},
                headers=origin,
            )
            assert login.status_code == 200 and login.json() == {"user": user}
            assert client.get("/api/v1/auth/me").json() == {"user": user}

            async def check_storage():
                from app.core.security import token_digest, verify_password

                async with get_engine().connect() as connection:
                    row = (
                        await connection.execute(
                            text("SELECT password_hash FROM users WHERE email=:email"),
                            {"email": email},
                        )
                    ).one()
                    assert row[0] != password and verify_password(password, row[0])
                    digest = (
                        await connection.execute(
                            text(
                                "SELECT token_digest FROM auth_sessions WHERE user_id=:id"
                            ),
                            {"id": user["id"]},
                        )
                    ).scalar_one()
                    assert digest == token_digest(
                        client.cookies.get("prepbuddy_session")
                    )
                    assert digest != client.cookies.get("prepbuddy_session")
                    await connection.execute(
                        text(
                            "UPDATE auth_sessions SET expires_at=now()-interval '1 second' WHERE user_id=:id"
                        ),
                        {"id": user["id"]},
                    )
                    await connection.commit()

            assert client.portal is not None
            client.portal.call(check_storage)
            assert client.get("/api/v1/auth/me").status_code == 401
    finally:

        async def cleanup():
            async with get_engine().begin() as connection:
                if (
                    await connection.execute(text("SELECT to_regclass('public.users')"))
                ).scalar_one() is None:
                    return
                await connection.execute(
                    text("DELETE FROM users WHERE email=:email"), {"email": email}
                )
                assert (
                    await connection.execute(
                        text("SELECT count(*) FROM users WHERE email=:email"),
                        {"email": email},
                    )
                ).scalar_one() == 0
            await get_engine().dispose()
            get_engine.cache_clear()

        asyncio.run(cleanup())
