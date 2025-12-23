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

## Last Session (2025-12-23)
Migrated from Anthropic API to Claude Code CLI:
- `src/responder.ts` - Now spawns `claude` CLI
- `src/responder-gemini.ts` - NEW fallback
- `src/subagents/retriever.ts` - Uses Gemini instead of Haiku
- `src/index.ts` - Dual responder support
- `src/server.ts` - HTTP API with responder selection
- Removed `@anthropic-ai/sdk` from package.json

## Refinements Pending
User will specify. Migration is complete but needs testing/adjustments.

## Key Files
- `src/responder.ts` - Claude Code CLI integration
- `src/responder-gemini.ts` - Gemini fallback
- `src/index.ts` - Main API (query, search)
- `src/server.ts` - Bun HTTP server
- `src/components/rag/` - React components

## Environment
```
GOOGLE_AI_API_KEY=xxx          # Required
RAG_RESPONDER=claude|gemini    # Optional, default: claude
```

## Note
102 pre-existing TypeScript errors in React components (TSX/DOM config) - not from this migration.
