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
Phase: refactor-hunt
Feature: FileManifest Cyberpunk Artifact
Files: FileManifest.tsx, file-manifest.base.css, file-manifest.cyberpunk.css, AdminDashboard.tsx
Validation-Report: reports/validation-file-manifest-cyberpunk.md

## Last Session (2025-12-29)
**FileManifest Cyberpunk Validation + Fixes:**
- Report: reports/validation-file-manifest-cyberpunk.md
- Tests: MISSING (no coverage)
- API: PASS (types match)
- Wiring: PASS (imports/exports correct)
- Fixes Applied:
  - B2: Removed derived `corruptionIntensity` from useMemo deps
  - BUG-1: Added `--hole-index` CSS variable to feed holes
- Remaining: B1 (deferred), B3-B5 (long-term optimizations)

## Completed
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
