"""Run with .venv/bin/python tests/integration/auth_http_smoke.py against local Uvicorn."""

import asyncio
import secrets
import uuid

import httpx
from sqlalchemy import text

from app.db.session import get_engine


def main():
    email = f"http-auth-test-{uuid.uuid4().hex}@example.com"
    password = secrets.token_urlsafe(24)
    headers = {"Origin": "http://localhost:3000"}
    try:
        with httpx.Client(base_url="http://127.0.0.1:8000", headers=headers) as client:
            assert client.get("/api/v1/health").status_code == 200
            assert client.get("/api/v1/auth/me").status_code == 401
            register = client.post(
                "/api/v1/auth/register",
                json={
                    "name": "HTTP Smoke Test",
                    "email": email,
                    "password": password,
                },
            )
            assert register.status_code == 201, register.status_code
            user = register.json()
            assert "Secure" not in register.headers["set-cookie"]
            assert client.get("/api/v1/auth/me").json() == user
            logout = client.post("/api/v1/auth/logout")
            assert logout.status_code == 200 and logout.json() == {
                "message": "Logged out"
            }
            assert client.get("/api/v1/auth/me").status_code == 401
            login = client.post(
                "/api/v1/auth/login", json={"email": email, "password": password}
            )
            assert login.status_code == 200 and login.json() == user
            assert client.get("/api/v1/auth/me").json() == user
            assert client.post("/api/v1/auth/logout").status_code == 200
            assert client.get("/api/v1/auth/me").status_code == 401
            print(
                "Live HTTP: register 201, me 200, logout 200, me 401, login 200, me 200; local cookie verified"
            )
    finally:

        async def cleanup():
            async with get_engine().begin() as connection:
                await connection.execute(
                    text("DELETE FROM users WHERE email=:email"), {"email": email}
                )
                remaining = (
                    await connection.execute(
                        text("SELECT count(*) FROM users WHERE email=:email"),
                        {"email": email},
                    )
                ).scalar_one()
                assert remaining == 0
            await get_engine().dispose()
            print("Synthetic HTTP account/session cleanup verified")

        asyncio.run(cleanup())


if __name__ == "__main__":
    main()
