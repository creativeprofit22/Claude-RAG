# Claude-RAG UX Improvement Plan

## Overview
Transform Claude-RAG from a chat-only interface into a full document management system with categorization, search, and an integrated library view.

## Current State
- Chat UI works well (RAGChat component)
- Documents can be added/deleted via CLI/API
- RAGModal exists but isn't integrated
- LanceDB stores: documentId, documentName, chunkIndex, timestamp, source, type
- **Gap:** No document browser, no categorization, no admin view

---

## Phase 1: MVP - Document Library (HIGH Priority)

### Goal
Create a functional document library with viewing, searching, and basic management.

### 1.1 Database Enhancements

**File:** `src/database.ts`

```typescript
// New interface for document summary
interface DocumentSummary {
  documentId: string;
  documentName: string;
  chunkCount: number;
  timestamp: number;
  source?: string;
  type?: string;
  categories?: string[];
  tags?: string[];
}

// New methods to add:
// - getDocumentSummaries(): Returns full metadata for all documents
// - getDocumentDetails(id): Get single document with chunk previews
// - updateDocumentMetadata(id, metadata): Update categories/tags
```

### 1.2 API Endpoints

**File:** `src/server.ts`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/rag/documents/details` | GET | List all documents with full metadata |
| `/api/rag/documents/:id/details` | GET | Get single document details |
| `/api/rag/documents/:id/metadata` | PATCH | Update document metadata |
| `/api/rag/categories` | GET | List all categories |
| `/api/rag/categories` | POST | Create new category |

### 1.3 New React Components

```
src/react/
  components/
    documents/
      DocumentLibrary.tsx      # Main container with list/grid toggle
      DocumentList.tsx         # List view with sorting columns
      DocumentCard.tsx         # Individual document card
      DocumentSearch.tsx       # Search bar with filters
      DocumentPreview.tsx      # Content preview modal
    categories/
      CategoryManager.tsx      # Category CRUD
      CategoryBadge.tsx        # Category chip display
      CategoryFilter.tsx       # Filter dropdown
    shared/
      ConfirmDialog.tsx        # Confirmation modal
      Pagination.tsx           # Pagination controls
  hooks/
    useDocuments.ts           # Document fetching/state
    useCategories.ts          # Category management
```

### 1.4 DocumentLibrary Features
- List view with columns: Name, Type, Chunks, Date, Categories
- Sort by: name, date, chunk count
- Search by document name
- Filter by category/tag
- Bulk selection with checkboxes
- Bulk delete operation

---

## Phase 2: Categorization System (MEDIUM Priority)

### Goal
Add full categorization and tagging capabilities.

### 2.1 Category Storage

**Recommended:** JSON file for simplicity (no schema migration needed)

**File:** `data/categories.json`
```json
{
  "categories": [
    { "id": "cat_1", "name": "Technical Docs", "color": "#3b82f6", "icon": "file-code" },
    { "id": "cat_2", "name": "Meeting Notes", "color": "#10b981", "icon": "users" }
  ],
  "tags": ["important", "draft", "reviewed", "archived"]
}
```

**File:** `data/document-metadata.json`
```json
{
  "doc_123456": { "categories": ["cat_1"], "tags": ["important"] },
  "doc_789012": { "categories": ["cat_2"], "tags": ["draft"] }
}
```

### 2.2 Why Separate Metadata File?
LanceDB is append-only, so updating metadata on chunks is expensive (requires re-inserting all chunks). Storing mutable metadata (categories, tags) in a separate JSON file is:
- Fast to read/write
- No need to touch embeddings
- Easy to backup/restore

### 2.3 Category Management UI
- Color picker for category colors
- Icon selection (from Lucide icons)
- Drag-drop category ordering
- Category usage counts

---

## Phase 3: Chat Integration (HIGH Priority)

### Goal
Seamless toggle between Chat and Documents views.

### 3.1 Unified RAG Interface

**File:** `src/react/RAGInterface.tsx`

```typescript
interface RAGInterfaceProps extends RAGChatProps {
  showDocumentLibrary?: boolean;
  defaultView?: 'chat' | 'documents';
  onDocumentSelect?: (doc: DocumentSummary) => void;
}
```

Features:
- Tab navigation: Chat | Documents
- Document context indicator in chat header
- "Query this document" action from library
- Source citations link back to document preview

### 3.2 Document Scoping in Chat
When user selects a document from library:
1. Show document badge in chat header
2. All queries filtered to that document
3. Clear button to remove filter
4. Option to query across all documents

### 3.3 Enhanced Source Citations
- Click source to open document preview
- Highlight matched chunk in preview
- "Show more context" expansion

---

## Phase 4: Enhanced Upload (MEDIUM Priority)

### Goal
Improve document upload with preview and categorization.

### 4.1 Upload Modal Features
- File preview before upload (render markdown/text)
- Category selection dropdown
- Tag input with autocomplete
- Custom document name override
- Chunk size preview ("Will create ~X chunks")

### 4.2 Progress Indicators
Show staged progress:
1. Uploading file (X%)
2. Extracting text
3. Generating embeddings (X/Y chunks)
4. Storing in database
5. Complete

### 4.3 Drag-Drop Enhancements
- Drop zone highlights on drag
- Multiple file queue
- Per-file status indicators
- Retry failed uploads

---

## Phase 5: Admin Dashboard (LOW Priority)

### Goal
Overview and system health monitoring.

### 5.1 Dashboard Stats
- Total documents / chunks
- Storage usage estimate
- Documents by category (pie chart)
- Recent uploads timeline
- Query frequency (if logging enabled)

### 5.2 System Health
- Embedding service status
- Database connection status
- Responder availability (Claude/Gemini)
- Last successful query timestamp

---

## Implementation Sequence

### Sprint 1: MVP Document Library (3-4 days)
1. Add `getDocumentSummaries()` to database.ts
2. Add `/api/rag/documents/details` endpoint
3. Create `DocumentLibrary`, `DocumentList`, `DocumentCard` components
4. Add basic tab navigation between Chat and Documents
5. Wire up delete functionality

### Sprint 2: Categories Core (3-4 days)
1. Create `data/categories.json` and `data/document-metadata.json`
2. Add category CRUD endpoints
3. Create `CategoryManager`, `CategoryFilter`, `CategoryBadge`
4. Add category assignment during upload

### Sprint 3: Polish & Search (2-3 days)
1. Document name search with debouncing
2. Sort controls in DocumentList
3. Bulk selection and delete
4. Document preview modal

### Sprint 4: Full Integration (3-4 days)
1. Build `RAGInterface` unified component
2. Document scoping in chat queries
3. Enhanced upload modal with categories
4. Clickable source citations with preview

### Sprint 5: Dashboard (Optional, 2 days)
1. Stats API endpoint
2. Dashboard component with charts
3. Health monitoring display

---

## File Changes Summary

### New Files
| File | Purpose |
|------|---------|
| `src/react/components/documents/DocumentLibrary.tsx` | Main library container |
| `src/react/components/documents/DocumentList.tsx` | List view with sorting |
| `src/react/components/documents/DocumentCard.tsx` | Document card component |
| `src/react/components/documents/DocumentSearch.tsx` | Search/filter bar |
| `src/react/components/documents/DocumentPreview.tsx` | Preview modal |
| `src/react/components/documents/UploadModal.tsx` | Enhanced upload |
| `src/react/components/categories/CategoryManager.tsx` | Category CRUD |
| `src/react/components/categories/CategoryBadge.tsx` | Category chip |
| `src/react/components/categories/CategoryFilter.tsx` | Filter dropdown |
| `src/react/components/shared/ConfirmDialog.tsx` | Confirmation dialog |
| `src/react/components/shared/Pagination.tsx` | Pagination controls |
| `src/react/hooks/useDocuments.ts` | Document data hook |
| `src/react/hooks/useCategories.ts` | Category hook |
| `src/react/RAGInterface.tsx` | Unified chat + documents |
| `data/categories.json` | Category definitions |
| `data/document-metadata.json` | Document category/tag mappings |

### Files to Modify
| File | Changes |
|------|---------|
| `src/database.ts` | Add `getDocumentSummaries()`, `getDocumentDetails()` |
| `src/server.ts` | Add new API endpoints |
| `src/index.ts` | Export new functions |
| `src/react/types.ts` | Add DocumentSummary, Category interfaces |
| `src/react/index.ts` | Export new components |
| `src/react/styles.css` | Add document library styles |
| `src/react/RAGChat.tsx` | Add documentId filtering support |

---

## Technical Decisions

### State Management
React hooks with local state is sufficient for this scope. No need for Redux/Zustand.

### Category Storage
JSON files over database tables:
- Simpler implementation
- No schema migration
- Fast read/write
- Easy to backup

### Search
In-memory filtering for document names (document counts typically <1000). Full-text search in chunks uses existing vector search.

### Component Styling
Follow existing patterns in `styles.css`:
- CSS custom properties (`--rag-*`)
- Dark theme by default
- Glassmorphism design language
- Lucide React icons

---

## User Flow After Implementation

1. **Browse Documents**: User clicks "Documents" tab, sees all uploaded docs with categories
2. **Filter/Search**: User filters by category or searches by name
3. **Select Document**: User clicks document to preview content
4. **Query Document**: User clicks "Chat about this" to scope queries
5. **Upload New**: User drags file, assigns category, uploads with progress
6. **Organize**: User bulk-selects documents, assigns categories
7. **Return to Chat**: User switches to Chat tab, sees context indicator

---

## Success Metrics

- Users can find documents without knowing exact names
- Documents are organized into meaningful categories
- Upload experience shows clear progress
- Chat queries can be scoped to specific documents
- Source citations lead back to document context
