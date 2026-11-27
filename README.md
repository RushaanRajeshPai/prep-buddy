# PrepBuddy

AI-assisted interview and group-discussion practice through text and voice conversations.

## Status

Home page implemented locally: responsive light-only Next.js UI, login/register entry pages, and a FastAPI backend connected to a dedicated local PostgreSQL database. Email/password authentication and account sessions are implemented locally. Interview sessions, AI and voice are not implemented yet. Nothing has been deployed.

## Planned stack

- **Backend:** Python, FastAPI, Pydantic, SQLAlchemy, Alembic.
- **Database:** PostgreSQL.
- **AI:** LangChain orchestration with Gemini through Google Vertex AI. LangChain is an integration framework, not itself an LLM.
- **Frontend:** Next.js App Router, TypeScript, Tailwind CSS.
- **Voice:** provider-neutral adapters; proposed Google Cloud streaming STT and TTS, with Vapi evaluated as an alternative. Final selection is pending.
- **Experience:** responsive mobile-first layouts, light mode only for this phase.

## Repository layout

```text
prep-buddy/
├── backend/       # FastAPI, domain services, AI/voice adapters, migrations, tests
├── frontend/      # Next.js routes, UI, feature modules, theme, tests
├── docs/          # Architecture, exact planned files, UX and voice decisions
└── infra/         # Reserved for future local/deployment configuration
```

## Planning documents

- [File structure](docs/file-structure.md)
- [Architecture](docs/architecture.md)
- [Voice options](docs/voice-options.md)
- [Responsive design and themes](docs/design-requirements.md)
- [Local setup and start commands](docs/local-development.md)
- [Proposed deployment](docs/deployment.md)

## Credentials

Keep service-account JSON, API keys, database credentials, and recordings out of Git. Existing credentials in other projects were inspected locally for configuration shape only; none were copied here or tested against Google. A dedicated PrepBuddy service account/project is preferred before implementation to isolate access, billing, and quotas. Never expose credentials through `NEXT_PUBLIC_*` variables.

## Next phase

Confirm voice provider, authentication, interview categories, group-discussion scope (AI participants first versus human multiplayer), data retention, hosting, and model before implementing. The proposed starting scope is one user with an AI interviewer or AI discussion participants; human multiplayer is not assumed.
