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
Section: Document Library Module
Files: src/react/components/documents/*, src/react/hooks/useDocuments.ts, src/react/hooks/useCategories.ts, src/categories.ts, src/database.ts

## Pipeline State
Phase: build
Feature: Document Library & Categorization
Status: Pipeline complete
Reports:
  - bugs: reports/bugs-document-library.md
  - refactors: reports/refactors-document-library.md

## Last Session (2025-12-24)
Completed low priority refactors (final tier):
- Extracted reusable `Dropdown` component from DocumentSearch
- Moved `getDocumentIcon` to `src/react/utils/documentIcons.ts`
- Added `withTable<T>` wrapper in database.ts (refactored 5 methods)
- All 10 refactors complete (2 high, 4 medium, 4 low)
- Tested: API endpoints, TypeScript compilation pass
- Committed: 622e55d

## Completed Features
- **Document Library** (2025-12-24): Phase 1 complete, all 14 bugs fixed
- **Category System** (2025-12-24): JSON-based storage, CRUD API, React components
- **Chat Scroll Fix** (2025-12-24): Bug fixes + refactoring complete
- **Demo UI Page** (2025-12-24): Security fixes, refactors complete

## Package Usage
```tsx
// Backend API
import { query, addDocument, getDocumentSummaries, getDocumentDetails } from 'claude-rag';

// React Chat UI
import { RAGChat } from 'claude-rag/react';
import 'claude-rag/react/styles.css';

<RAGChat endpoint="/api/rag/query" />

// React Document Library
import { DocumentLibrary } from 'claude-rag/react';

<DocumentLibrary
  endpoint="/api/rag"
  onDocumentSelect={(doc) => console.log('Query:', doc.documentId)}
/>
```

## Key Files
- `src/index.ts` - Main API exports
- `src/server.ts` - Bun HTTP server
- `src/database.ts` - LanceDB wrapper with document queries
- `src/categories.ts` - Category storage helpers
- `src/react/components/documents/DocumentLibrary.tsx` - Document browser
- `src/react/hooks/useDocuments.ts` - Document management hook

## Environment
```
GOOGLE_AI_API_KEY=xxx          # Required
RAG_RESPONDER=claude|gemini    # Optional, default: claude
```
