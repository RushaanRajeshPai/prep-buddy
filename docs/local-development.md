# Local development

## Current setup

- Frontend: Next.js at http://localhost:3000.
- Backend: FastAPI at http://127.0.0.1:8000; docs at `/docs`.
- Readiness: `/api/v1/health` performs a real PostgreSQL `SELECT 1`, returning 503 if the database is unavailable.
- Database: dedicated `prep_buddy` database in the existing Postgres.app instance on loopback port 5432. Dedicated `prep_buddy_app` login has no superuser/create-database/create-role privilege. Existing databases were left intact.
- Credentials: backend/.env, owner-only and ignored by Git. Never copy its URL into frontend/public configuration.
- Authentication uses dedicated users/session tables managed by Alembic. No replacement database or mock database is used.

## Repeat start

Ensure Postgres.app is running. Use separate terminals:

```sh
cd backend
.venv/bin/python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 --no-proxy-headers
```

```sh
cd frontend
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Stop only these application processes with Ctrl+C; do not delete the database or reset unrelated PostgreSQL storage.

## First-time installation on another machine

Backend: use Python 3.12+, create `.venv`, install `requirements.lock` then `pip install -e . --no-deps`; add dev tools for tests as needed. Frontend: `npm ci` using the committed lockfile. Copy backend/.env.example to backend/.env, supply a dedicated local PostgreSQL connection and limit permissions. An example file does not create a database or verify connectivity.

## Database migrations

From `backend/`, run `.venv/bin/alembic upgrade head` on a new authorized database, and `.venv/bin/alembic current` to check its version. The local database is at `0001_auth`; migrations are never run implicitly on app startup. Passwords use Argon2id; opaque session tokens are stored only as SHA256 digests. Email verification and password reset are not yet implemented. The local rate limit is single-process and must be replaced/adapted for distributed production use.

## Scope

Registration/login use the backend API through same-origin Next.js rewrites. Session cookies are HttpOnly; the backend validates access. Passwords are hashed, not stored as plaintext. Local HTTP uses non-Secure cookies; HTTPS deployment must enable Secure cookies and the exact production origin allowlist. Homepage conversation samples are labeled examples, not live AI. No Google credentials have been imported and no paid APIs activated.
