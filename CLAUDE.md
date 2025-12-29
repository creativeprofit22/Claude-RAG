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
Feature: HUD Frame Cyberpunk Artifact
Files-Validated: HudFrame.tsx, hud-frame.base.css, hud-frame.cyberpunk.css, AdminDashboard.tsx
Validation-Report: reports/validation-hud-frame-cyberpunk.md

## Last Session (2025-12-29)
**HUD Frame Validation - Clean:**
- Tests: skipped (none exist)
- API: pass (endpoint working)
- UI: pass (accessibility, loading, CSS, responsive)
- Wiring: pass (imports, props, children all correct)
- Bottlenecks: 2/7 fixed (React.memo, animation distance)
- Bugs: 2/7 fixed (z-index traces, animation)

## Completed
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
