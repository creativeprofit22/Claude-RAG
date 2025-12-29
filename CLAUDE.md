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
Feature: Phase 3 - Modals + Upload Motion System
Status: Built, validated, refactored

## Completed
- Phase 3: Modals + Upload Motion System (2025-12-28)

## Last Session (2025-12-28)
**Phase 3 Refactoring Complete - All 7 Fixes Applied:**
- High: Triple filter → single reduce (FileQueue), React.memo + useCallback (FileQueueItem)
- Med: useMemo for accent styles (DocumentPreview), DEFAULT_ACCEPT constant (FileDropZone), consistent imports (UploadModal), filesRef for stale closure (UploadModal)
- Low: editName sync effect (FileQueue)
- Build + tests green (21 pass)

## Key Files
- `src/server.ts` - Bun HTTP server
- `src/database.ts` - LanceDB wrapper
- `src/responder.ts` - Claude CLI integration
- `src/react/` - React components and hooks
- `src/react/tokens/` - Curator design tokens
- `src/react/fonts/` - Self-hosted Fraunces + Satoshi

## Environment
```
GOOGLE_AI_API_KEY=xxx          # Required
RAG_RESPONDER=claude|gemini    # Optional, default: claude
```
