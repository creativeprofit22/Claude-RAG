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
Feature: FileManifest Cyberpunk Artifact
Status: Production-ready

## Last Session (2025-12-29)
**FileManifest Cyberpunk - Complete:**
- Validation: reports/validation-file-manifest-cyberpunk.md
- Refactors: reports/refactors-file-manifest-cyberpunk.md
- Fixes Applied: 5 total
  - B2: Removed derived dep from useMemo
  - BUG-1: Added --hole-index CSS variable
  - #2: Removed duplicate border-radius
  - #5: Cleaned className concatenation
  - #6: Removed empty CSS rule
- Deferred: B1, B3-B5 (performance), #3-4 (magic numbers), #7-8 (optional)

## Completed
- FileManifest Cyberpunk Artifact (2025-12-29) - Built, validated, refactored (5 fixes)
- PowerConduit Cyberpunk Artifact (2025-12-29) - Built, validated, refactored (4 items)
- StatChip Cyberpunk Artifact (2025-12-28) - Built, validated, refactor-hunted (clean)
- Phase 3: Modals + Upload Motion System (2025-12-28)
- Final E2E Validation (2025-12-29)

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
