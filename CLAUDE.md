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
Phase: build
Feature: Demo UI Full Features
Status: RAGInterface + AdminDashboard integrated, scrollbar bug pending

## Reports
- bugs: `reports/bug-report-2025-12-25.md`
- refactors: `reports/refactors-comprehensive-bug-fixes.md`

## Last Session (2025-12-25)
- Fixed lucide-shim.js: vanilla lucide exports `["svg", attrs, [children]]`, shim now extracts `iconDef[2]` for child elements
- Switched demo from RAGChat → RAGInterface (adds Chat/Documents tabs)
- Added AdminDashboard below chat wrapper
- Updated demo.js: `initDemo(RAGInterface, AdminDashboard)`, uses `endpoint` (base) not `endpoint/query`
- Removed `overflow: hidden` from `.chat-wrapper` in demo/styles.css
- Restarted server (PID was stale)
- **BUG**: Clicking Documents tab causes browser page scrollbar to disappear

## Next Steps
1. Fix Documents tab scrollbar issue (page-level scroll disappears)
2. Test all features: Chat, Documents library, AdminDashboard
3. Verify document upload, search, delete functionality

## Key Files
- `src/server.ts` - Bun HTTP server
- `src/database.ts` - LanceDB wrapper
- `src/responder.ts` - Claude CLI integration
- `src/react/` - React components and hooks

## Environment
```
GOOGLE_AI_API_KEY=xxx          # Required
RAG_RESPONDER=claude|gemini    # Optional, default: claude
```
