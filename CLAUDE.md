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
Feature: Library Skin - Aged Brass Colors
Status: Built, validated, refactored - COMPLETE

## Last Session (2025-12-29)
**Library Skin - Aged Brass Refactoring:**
- Fixed remaining bright gold rgba values → aged brass (139, 112, 40)
- Removed redundant `-webkit-clip-path: none` from stat-chip
- Already had `:is()` selector in terminal-readout
- All shared tokens already in use via library-base.css
- Tests: 21 pass | Build: success (97.9kb CSS bundle)

## Completed
- Library Skin Aged Brass (2025-12-29) - Colors fixed, refactored, committed
- Library Skin Artifacts (2025-12-29) - Built, validated, refactored (8 items)
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
