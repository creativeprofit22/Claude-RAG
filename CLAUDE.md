# Claude-RAG

Reusable RAG component for embedding into projects. Uses Claude Code CLI (user's subscription) for responses - NOT Anthropic API.

## CRITICAL CONSTRAINT
**NO Anthropic API.** User has Claude Max subscription. Response generation uses:
- Primary: Claude Code CLI (`claude -p "..." --print`)
- Fallback: Gemini 2.0 Flash

## Flow
```
Query → Gemini Embeddings → LanceDB → Chunks → Claude Code CLI → Response
```

## Pipeline State
Phase: complete
Feature: In-App Gemini API Key Input

## Last Session (2025-12-26)
Refactors completed (all 6):
1. **Magic numbers extracted** - GOOGLE_AI_KEY_PREFIX/LENGTH constants in server.ts
2. **Wrapper function removed** - handleConfigured replaced with direct checkStatus
3. **respondersEndpoint prop added** - ApiKeyConfigBar now passes through
4. **Duplicate hooks consolidated** - apiKeyState prop for props drilling
5. **Aria-describedby added** - SettingsModal input linked to description
6. **Cross-tab sync added** - localStorage storage event listener

Reports: validation-gemini-api-key.md, refactor-gemini-api-key.md

## Previous Session (2025-12-26)
- Validated Gemini API key feature (6-agent parallel validation)
- Fixed: headers useMemo, AbortController cleanup, fragile endpoint URL
- Fixed: localStorage try-catch, non-JSON response handling

## Key Files
- `src/server.ts` - Bun HTTP server
- `src/database.ts` - LanceDB wrapper
- `src/responder.ts` - Claude CLI integration
- `src/react/` - React components and hooks

## Environment
```
GOOGLE_AI_API_KEY=xxx          # Required
RAG_RESPONDER=claude|gemini    # Optional, default: claude
```
