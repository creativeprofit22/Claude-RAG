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
All phases complete - project stable

## Pipeline State
Phase: stable
Feature: All features complete
Status: Tested and verified

## Last Session (2025-12-25)
Full system testing completed:
- 21/21 unit tests passing
- All API endpoints verified working:
  - /api/rag/documents, /api/rag/documents/details
  - /api/rag/documents/:id/details, /api/rag/documents/:id/metadata
  - /api/rag/categories (CRUD)
  - /api/rag/tags
  - /api/rag/admin/stats, /api/rag/admin/health, /api/rag/admin/dashboard
  - /api/rag/search, /api/rag/query
  - /api/rag/upload, /api/rag/upload/stream
- Demo UI loading correctly at /demo
- TypeScript check passed

## Completed Features
- **Admin Dashboard** (2025-12-25): Stats API, Health API, AdminDashboard component, charts, service monitoring
- **Enhanced Upload** (2025-12-25): SSE progress streaming, PDF/DOCX extraction, multi-file queue, category selection
- **Chat Integration** (2025-12-24): RAGInterface component with tab navigation + document scoping
- **Document Library** (2025-12-24): Phase 1 complete, all 14 bugs fixed
- **Category System** (2025-12-24): JSON-based storage, CRUD API, React components
- **Chat Scroll Fix** (2025-12-24): Bug fixes + refactoring complete
- **Demo UI Page** (2025-12-24): Security fixes, refactors complete

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
