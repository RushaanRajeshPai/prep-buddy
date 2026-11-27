# Proposed deployment — later phase

Nothing is deployed or provisioned by the home-page task.

## Recommended initial topology

- Next.js frontend on Vercel (or another Next.js-compatible host).
- FastAPI on a container host that supports long-lived WebSockets for the later voice phase, such as Cloud Run, with its connection timeout/reconnect design reviewed first.
- Managed PostgreSQL, ideally in the backend's region, with private/network-restricted access where supported, TLS and backups.
- A dedicated PrepBuddy Google Cloud service account for Vertex/STT/TTS with least-privilege permissions and explicit billing budgets. Prefer workload identity to shipped JSON keys.

These are proposed choices, not claims about free plans, pricing or configured platform support. Confirm current limits/costs before provisioning.

## Release sequence

1. Choose hosting, region, domain, costs and data retention.
2. Provision a new production database; do not replace local storage or automatically upload development data. Agree a backup/migration plan if data must move.
3. Add backend container and CI checks. Configure production database credentials in host secret storage, not Git or browser env.
4. Add reviewed Alembic migrations with the first persistent models; run them as a controlled release task against the verified target.
5. Configure backend HTTPS origin, exact frontend CORS allowlist and frontend API routing. Configure secure cookies/CSRF when authentication exists.
6. Deploy frontend, connect custom domains and verify the exact release SHA, live health/database connectivity, browser routing, login and authorized sessions.
7. Verify budgets, backups/restore and retention; add voice only after speech permissions, HTTPS microphone behaviour and WebSocket reconnects are exercised.

A successful Git push is not a verified deployment. Hosting setup and monthly estimates will be discussed before any cloud resources or paid services are created.
