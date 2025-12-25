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

## Current Focus
Bug fixing - 52 bugs identified across codebase

## Pipeline State
Phase: debugging
Feature: Comprehensive bug fixes
Tier: medium
Status: pending

## Reports
- bugs: `reports/bug-report-2025-12-25.md`

## Last Session (2025-12-25)
Fixed all 12 HIGH priority bugs:
- server.ts: Added try-catch to deleteDocument, getDocumentSummaries, query; fixed CORS preflight; SSE flush
- database.ts: Null check after connect(), race condition handling, validateDocumentId() for injection prevention
- useFileQueue.ts: Fixed stale closure with filesRef
- useUploadStream.ts: Added reader cleanup on unmount
- useDocumentLibraryState.ts: Verified ref pattern is correct
- Type check passed with no errors

## Next Steps
1. Fix 24 MEDIUM priority bugs
2. Fix 19 LOW priority bugs
3. Run tests to verify fixes

## Package Usage
```tsx
// Backend API
import { query, addDocument, getDocumentSummaries, getDocumentDetails } from 'claude-rag';

// Unified Interface (Chat + Documents with tabs)
import { RAGInterface } from 'claude-rag/react';
import 'claude-rag/react/styles.css';

<RAGInterface
  endpoint="/api/rag"
  chatTitle="Document Assistant"
  accentColor="#10b981"
/>

// Standalone Chat UI
import { RAGChat } from 'claude-rag/react';
<RAGChat endpoint="/api/rag/query" />

// Standalone Document Library
import { DocumentLibrary } from 'claude-rag/react';
<DocumentLibrary endpoint="/api/rag" onDocumentSelect={(doc) => console.log(doc)} />
```

## Key Files
- `src/index.ts` - Main API exports (addDocumentWithProgress, estimateChunks)
- `src/server.ts` - Bun HTTP server (includes SSE upload/stream endpoint)
- `src/database.ts` - LanceDB wrapper with document queries
- `src/categories.ts` - Category storage helpers
- `src/extractors/index.ts` - PDF/DOCX/text extraction dispatcher
- `src/react/RAGInterface.tsx` - Unified chat + documents tabbed interface
- `src/react/components/documents/DocumentLibrary.tsx` - Document browser with upload button
- `src/react/components/upload/UploadModal.tsx` - Enhanced upload modal with SSE progress
- `src/react/hooks/useDocuments.ts` - Document management hook
- `src/react/hooks/useUploadStream.ts` - SSE upload progress hook
- `src/react/hooks/useFileQueue.ts` - Multi-file queue management hook

## Environment
```
GOOGLE_AI_API_KEY=xxx          # Required
RAG_RESPONDER=claude|gemini    # Optional, default: claude
```
