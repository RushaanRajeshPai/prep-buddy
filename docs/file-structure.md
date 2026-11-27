# File structure

The tree below is the architectural roadmap retained from the initial commit; `[planned]` labels in that tree are historical, not a current implementation inventory. See the current implementation section below. Keep routes in `app`, shared UI in `components`, feature-specific UI in `features`, and backend API/config/database ownership in their named directories.

```text
prep-buddy/
├── README.md
├── .gitignore
├── .editorconfig
├── backend/
│   ├── pyproject.toml                       [planned: Python dependencies/tooling]
│   ├── .env.example                         [planned: variable names, no secrets]
│   ├── alembic.ini                          [planned]
│   ├── app/
│   │   ├── main.py                          [planned: FastAPI app/lifespan]
│   │   ├── api/
│   │   │   ├── dependencies.py              [planned: auth, DB, service injection]
│   │   │   └── v1/
│   │   │       ├── router.py                [planned]
│   │   │       └── routes/
│   │   │           ├── auth.py              [planned]
│   │   │           ├── users.py             [planned]
│   │   │           ├── sessions.py          [planned: interview/GD lifecycle]
│   │   │           ├── conversations.py     [planned: text/streaming messages]
│   │   │           ├── voice.py             [planned: audio transport/control]
│   │   │           └── feedback.py          [planned: evaluations/reports]
│   │   ├── core/
│   │   │   ├── config.py                   [planned: validated settings]
│   │   │   ├── security.py                 [planned]
│   │   │   └── logging.py                  [planned: redact private data]
│   │   ├── db/
│   │   │   ├── session.py                  [planned: async SQLAlchemy]
│   │   │   └── base.py                     [planned]
│   │   ├── models/                         [planned: SQLAlchemy persistence]
│   │   │   ├── user.py
│   │   │   ├── practice_session.py
│   │   │   ├── participant.py
│   │   │   ├── message.py
│   │   │   └── evaluation.py
│   │   ├── schemas/                        [planned: Pydantic API contracts]
│   │   ├── repositories/                   [planned: database access]
│   │   ├── services/
│   │   │   ├── interviews/                 [planned: question/turn progression]
│   │   │   ├── discussions/                [planned: AI roles/turn management]
│   │   │   ├── conversations/              [planned: shared session engine]
│   │   │   └── feedback/                   [planned: evidence-based rubrics]
│   │   ├── ai/
│   │   │   ├── providers/                  [planned: Vertex model factory]
│   │   │   ├── chains/                     [planned: conversation/evaluation]
│   │   │   └── prompts/                    [planned: versioned prompt templates]
│   │   └── voice/
│   │       ├── providers/                  [planned: STT/TTS/provider adapters]
│   │       └── realtime/                   [planned: streaming/interruptions]
│   ├── migrations/
│   │   ├── env.py                          [planned]
│   │   └── versions/                       [planned: Alembic revisions]
│   └── tests/
│       ├── unit/
│       └── integration/
├── frontend/
│   ├── package.json                        [planned: Next/React/Tailwind]
│   ├── tsconfig.json                       [planned]
│   ├── next.config.ts                      [planned]
│   ├── postcss.config.mjs                   [planned]
│   ├── .env.example                         [planned: public API URL only]
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx                  [planned: global layout/providers]
│   │   │   ├── page.tsx                    [planned: landing page]
│   │   │   ├── globals.css                 [planned: Tailwind/theme tokens]
│   │   │   ├── (auth)/                     [planned: sign-in/sign-up]
│   │   │   └── (dashboard)/                [planned: signed-in route group]
│   │   │       ├── dashboard/page.tsx
│   │   │       ├── practice/page.tsx
│   │   │       ├── sessions/[sessionId]/page.tsx
│   │   │       ├── feedback/[sessionId]/page.tsx
│   │   │       └── settings/page.tsx
│   │   ├── components/
│   │   │   ├── ui/                         [planned: shared accessible primitives]
│   │   │   ├── layout/                     [planned: nav/app shell]
│   │   │   └── theme/                      [planned: provider/theme toggle]
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── interviews/
│   │   │   ├── discussions/
│   │   │   ├── conversations/
│   │   │   ├── voice/
│   │   │   └── feedback/
│   │   ├── hooks/                          [planned: shared browser hooks]
│   │   ├── lib/                            [planned: API client/utilities]
│   │   └── types/                          [planned: generated OpenAPI types]
│   ├── public/                             [planned: public non-secret assets]
│   └── tests/
│       ├── unit/
│       └── e2e/
├── docs/
│   ├── file-structure.md
│   ├── architecture.md
│   ├── voice-options.md
│   └── design-requirements.md
└── infra/
    ├── local/                              [planned: isolated PostgreSQL/dev setup]
    └── deployment/                         [planned: hosting configuration]
```

Route groups in parentheses organize Next.js layouts without changing URLs. API types will be generated from FastAPI's OpenAPI contract when client API features are introduced.

## Current implementation

- Backend: `app/main.py`, `core/config.py`, `db/session.py`, `api/dependencies.py`, `api/v1/router.py`, and `api/v1/routes/health.py`; manifests, installed-version lock and unit/integration tests.
- Frontend: `src/app/layout.tsx`, `page.tsx`, `globals.css`; shared `components/layout/navbar.tsx` and `footer.tsx`; feature owner `features/home/home-landing.tsx` and `features/auth/account-preview.tsx`; `(auth)/login/page.tsx` and `(auth)/register/page.tsx`; dependency lock and behaviour tests.
- `features/home/` is an intentional extension: home-page composition lives in a feature owner rather than bloating the route or shared layout components.
- Root `pyrightconfig.json` selects the backend virtual environment for Python editor diagnostics.
- `docs/local-development.md` describes local start/stop and database boundaries; `docs/deployment.md` describes the later proposed deployment.
- Authentication adds backend `models/user.py`, `models/auth_session.py`, `schemas/auth.py`, `core/security.py`, `core/auth_guard.py`, `api/v1/routes/auth.py`, and reviewed Alembic migrations. Frontend account forms/dashboard belong to `features/auth/`, with thin login/register/dashboard routes and API rewrite configuration.
- Unimplemented practice-domain/AI/voice directories remain reserved placeholders. No fake model, auth endpoint, table or migration was added to make the home page look functional.
