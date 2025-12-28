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
Feature: Skin System Bridge
Files-Validated: src/react/tokens/colors.css, demo/skins.css, demo/index.html
Validation-Report: reports/validation-skin-system-bridge.md

## Last Session (2025-12-28)
- **Skin System Bridge**: Implemented CSS custom property remapping so React components respond to skin switching
- **Validation**: 6 parallel agents ran tests/API/UI/wiring/bottlenecks/bugs checks
- **Bugs Fixed**:
  - `--curator-bg-elevated` mapping conflict resolved
  - `--curator-text-faint` now has correct fallback
  - Lucide error handling added for CDN failure graceful degradation
- **Status**: All checks passing, ready for refactor-hunt

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
