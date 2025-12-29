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
Feature: Phase 2 - Charts + Admin Components
Files-Validated:
- src/react/components/admin/AdminDashboard.tsx
- src/react/components/documents/DocumentList.tsx
- src/react/RAGInterface.tsx
- src/react/RAGChat.tsx
- src/react/components/documents/DocumentLibrary.tsx
Validation-Report: reports/validation-phase2-charts-admin.md

## Last Session (2025-12-28)
**Validation Complete - 4 Bugs Fixed:**
- AdminDashboard: Added headers to fetch, fixed null access on byCategory
- SkinAwareChart: Removed redundant skin change effect
- useRAGChat: Added effect to clear messages on documentId change
- All checks passing, build + tests green

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
