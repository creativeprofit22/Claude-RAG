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
Feature: StatChip Cyberpunk Artifact
Files-Validated: src/react/artifacts/stat-chip/*, src/react/components/admin/AdminDashboard.tsx
Validation-Report: reports/validation-stat-chip-cyberpunk.md

## Last Session (2025-12-28)
**StatChip Cyberpunk Artifact - Complete:**
- Built holographic data chip component for Admin Dashboard
- Fixed: Loading class, vendor prefixes, text overflow, copy-paste duplication
- Fixed: Glitch effect too subtle - increased frequency (3 bursts/3s cycle) + added skewX distortion
- Added: will-change performance hints, aria accessibility
- Demo CSS loading: Added ragchat-bundle.css to demo/index.html

## Completed
- Phase 3: Modals + Upload Motion System (2025-12-28)
- Final E2E Validation (2025-12-29)
- StatChip Cyberpunk Build + Validation (2025-12-28)

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
