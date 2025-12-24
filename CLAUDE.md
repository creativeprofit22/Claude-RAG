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
Phase: idle
Feature: None

## Last Session (2025-12-24)
- Committed and pushed Demo UI security fixes and refactors
- Verified server health endpoint on port 3001
- Tested RAG query via curl - both responders working
- Marked Demo UI Page feature complete

## Completed Features
- **Demo UI Page** (2025-12-24): Security fixes (XSS, memory leak, path traversal), refactors (CSS extraction, DRY helpers), tested and verified

## Next Steps
1. Pick next feature to work on (user decision)

## Package Usage
```tsx
// Backend API
import { query, addDocument } from 'claude-rag';

// React UI
import { RAGChat } from 'claude-rag/react';
import 'claude-rag/react/styles.css';

<RAGChat endpoint="/api/rag/query" />
```

## Key Files
- `src/index.ts` - Main API exports
- `src/server.ts` - Bun HTTP server
- `src/react/RAGChat.tsx` - Drop-in chat component
- `src/react/hooks/useRAGChat.ts` - React hook
- `src/react/styles.css` - Standalone styles

## Environment
```
GOOGLE_AI_API_KEY=xxx          # Required
RAG_RESPONDER=claude|gemini    # Optional, default: claude
```
