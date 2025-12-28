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
Feature: Glass Skin - Admin Panel Components
Files-Validated: demo/skins.css (lines 1287-1695)
Validation-Report: reports/validation-glass-admin.md

## Last Session (2025-12-28)
- **Validated**: Glass admin components (stat cards, panels, charts, service status)
- **Fixes Applied**: 8 total - focus-visible states, color fallbacks, cursor pointers, status variable colors
- **Performance**: Removed backdrop-filter from status badges
- **Pattern Consistency**: Now matches Brutalist/Cyberpunk patterns

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
