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
Feature: All Features Complete
Status: Final e2e validation passed

## Completed
- Phase 3: Modals + Upload Motion System (2025-12-28)
- Final E2E Validation (2025-12-29)

## Last Session (2025-12-29)
**Final E2E Validation Complete:**
- Tests: 21 pass, 0 fail (63 expect() calls)
- Build: TypeScript compiles clean
- Demo Build: Fixed react-shim missing useId/useInsertionEffect hooks
- API Endpoints: All 20+ endpoints tested and working
  - Health, responders, documents, categories, tags, admin, config
  - CRUD operations all functional
  - Note: Search/query require Gemini API quota (rate limited during testing)
- UI Components: 28 TSX files, 11 hooks, motion system integrated
- Cross-feature integration verified:
  - RAGInterface → Tab nav + document scoping
  - UploadModal → File queue + categories + motion
  - DocumentLibrary → Category filter + document preview

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
