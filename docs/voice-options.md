# Voice options

**Proposed starting point:** Google Cloud streaming Speech-to-Text plus Google Cloud Text-to-Speech, with the conversation engine owned by FastAPI/LangChain. This is an architectural recommendation to evaluate, not a benchmarked provider decision.

## Google Cloud STT + TTS

Google documents real-time streaming speech recognition, with streaming available through gRPC.[3] Google Cloud TTS synthesizes speech from text or SSML.[4]

I recommend evaluating this first because PrepBuddy already plans to use Vertex AI and wants its own LangChain conversation backend. It requires implementing browser audio transport, turn detection, interruption, playback and reconnection. Existing Vertex credentials do not prove speech API enablement or permissions. Compare latency, recognition quality for target accents/languages, voice quality and total per-session cost before selection.

## Vapi

Vapi provides a Web SDK for browser-based real-time voice conversations.[1]

Choose this alternative if a managed voice integration is preferred. Validate that its model/custom-backend path fits the desired Vertex/LangChain control before adoption; otherwise it changes who owns conversation orchestration. Provider pricing, data handling, authentication and integration constraints need a separate review; none were validated here.

## Whisper CLI

Whisper is a speech-recognition model, and its CLI transcribes audio files; the documented `transcribe()` method reads the entire file and processes it in sliding windows.[2]

I recommend keeping it as an optional recorded-answer/offline transcription path rather than the main live conversation interface. It is STT, not TTS; a separate speech-synthesis provider and real-time transport would still be needed.

## Evaluation gate

Before implementation, measure a representative interview conversation on mobile and desktop: partial/final transcript delay, response/audio latency, interruption, noisy-room accuracy, reconnect behavior, cost, consent and retention. Do not claim one provider is faster or cheaper without this comparison.

## Sources

[1] https://docs.vapi.ai/quickstart/web
[2] https://github.com/openai/whisper
[3] https://cloud.google.com/speech-to-text/docs/streaming-recognize
[4] https://cloud.google.com/text-to-speech/docs/create-audio
