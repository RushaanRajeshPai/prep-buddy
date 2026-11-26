# Proposed architecture

## Boundaries

- **Next.js:** responsive interface, themes, microphone permission/capture, audio playback, live transcript, session controls and feedback.
- **FastAPI:** authentication/authorization, session lifecycle, conversation orchestration, provider access, persistence and feedback.
- **PostgreSQL:** users, sessions, participants, messages and evaluations. Audio files belong in private object storage if recording retention is approved, not as database blobs or Git assets.
- **LangChain + Vertex AI:** shared backend model adapter, interview prompts, discussion personas and structured evaluation. Preserve prompt versions and selected model on sessions for traceability.
- **Voice providers:** separate STT, TTS and managed-agent adapters; no provider API secret in the browser.

## Proposed conversation paths

```text
Text:  Browser → FastAPI → LangChain/Vertex → streamed reply → Browser
Voice: Browser audio → FastAPI → STT → conversation engine → TTS → Browser audio
Data:  FastAPI ↔ PostgreSQL
```

The direct voice design proposes authenticated browser WebSockets into FastAPI, a provider-specific streaming STT connection, and streamed reply/audio events. Design reconnection, ordering, cancellation, end-of-turn detection and interruption before shipping. HTTPS is required for production microphone access; audio starts through an explicit user action to accommodate browser playback restrictions.

If Vapi is selected, its Web SDK owns the browser voice transport; FastAPI remains the owner of session access, data and feedback. Validate custom model/backend integration before expecting Vapi to reuse LangChain. Do not run independent Vapi and LangChain conversation loops for the same session.

## Proposed domain model

- `User`: identity and preparation preferences.
- `PracticeSession`: interview or discussion mode, target role/topic, difficulty, lifecycle, model/prompt metadata.
- `Participant`: user or named AI persona; supports multiple AI discussion participants without assuming human multiplayer.
- `Message`: participant, ordered turn, text/transcript, timestamps and delivery status.
- `Evaluation`: rubric/version, evidence-linked observations and actionable suggestions.

Keep active-session state distinct from persisted history. Session and message access must be scoped to the authenticated user. Exclude credentials and raw audio/transcripts from ordinary request logs. Recording consent, retention/deletion and third-party data sharing must be explicit.

## Credential discovery

Local inspection found service-account-shaped JSON in `GOOGLE_CLOUD_CREDENTIALS_JSON` in Ascend AI and Super Post-Audit environment configuration. JSON parsing and required-field presence were checked without exposing values. No credentials were copied, no OAuth/model requests were made, and no existing configuration was changed. Parsing does not establish credential validity, Vertex model access, STT/TTS API enablement or billing.

Future backend configuration should accept Application Default Credentials or a privately loaded service account. Prefer a dedicated least-privilege PrepBuddy account. Reusing the existing project's account would share billing/quota and requires a deliberate implementation decision.

## Decisions still open

Voice provider and region; Gemini model; authentication provider; supported languages; GD participant limits; raw-audio retention; hosting; and operational budgets. No versions or cloud resources are pinned/provisioned in this structural commit.
