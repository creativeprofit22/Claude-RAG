# Refactor Report: Document Library Module

Generated: 2025-12-24
Feature: Document Library & Categorization
Source: reports/bugs-document-library.md

## Scope
Files analyzed:
- src/react/components/documents/DocumentCard.tsx
- src/react/components/documents/DocumentLibrary.tsx
- src/react/components/documents/DocumentList.tsx
- src/react/components/documents/DocumentPreview.tsx
- src/react/components/documents/DocumentSearch.tsx
- src/react/components/shared/ConfirmDialog.tsx
- src/react/hooks/useDocuments.ts
- src/react/hooks/useCategories.ts
- src/categories.ts
- src/database.ts

## High Priority (Tech Debt / DRY)

| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 1 | useDocuments.ts + useCategories.ts | Near-identical hook structure (~80% similar) - both have AbortController management, error handling, headers stabilization, refetchRef pattern | Extract `useAPIResource` base hook or factory function that handles common patterns | L |
| 2 | DocumentPreview.tsx:36-45 + ConfirmDialog.tsx:38-47 | Identical modal behavior - ESC key handling, body scroll lock, cleanup on unmount | Extract `useModal` hook with `{ onClose }` parameter returning `{ handleBackdropClick }` | S |

## Medium Priority (Code Clarity)

| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 1 | DocumentCard.tsx:42-49 + DocumentPreview.tsx:55-63 | Duplicated `formatDate` functions with slightly different format options | Extract to `src/react/utils/formatDate.ts` with format presets (short, full, etc.) | S |
| 2 | DocumentList.tsx:36-48 + DocumentLibrary.tsx:182-195 | Similar empty state components with slightly different content | Create shared `EmptyState` component with customizable icon, title, description props | S |
| 3 | categories.ts:60-73 + 80-89 | `readCategoryStore` and `readDocMetadataStore` follow identical pattern | Create generic `readJsonStore<T>(path, fallback)` helper | S |
| 4 | DocumentLibrary.tsx | 289 lines with 10+ useCallback handlers | Consider extracting `useDocumentLibraryState` hook for local UI state management | M |

## Low Priority (Nice-to-Have)

| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 1 | DocumentSearch.tsx:117-150 | Dropdown logic (open/close, outside click, keyboard) embedded in component | Extract reusable `Dropdown` component for future use | M |
| 2 | DocumentCard.tsx:17-37 | `getDocumentIcon` mapping could grow over time | Move to `src/react/utils/documentIcons.ts` for centralized icon mapping | S |
| 3 | database.ts | Multiple methods check `if (!table) return` at start | Create private `withTable<T>` wrapper method to reduce boilerplate | S |
| 4 | categories.ts:75-78 + 92-95 | `writeCategoryStore` and `writeDocMetadataStore` follow identical pattern | Create generic `writeJsonStore<T>(path, data)` helper | S |

## Summary
- High: 2 refactors (0 Small, 1 Medium, 1 Large)
- Medium: 4 refactors (3 Small, 1 Medium, 0 Large)
- Low: 4 refactors (3 Small, 1 Medium, 0 Large)
- Total: 10 refactors

## Notes

### Hook Duplication (High #1)
`useDocuments.ts` and `useCategories.ts` share:
- AbortController setup and cleanup
- `refetchRef` pattern to avoid infinite loops
- Headers stabilization via `useMemo` + JSON.stringify
- Error handling pattern (setError, try/catch, AbortError check)
- Loading state management

A generic `useAPIResource` could reduce ~100 lines of duplicated code.

### Modal Hook (High #2)
Both modals implement:
```tsx
useEffect(() => {
  document.addEventListener('keydown', handleKeyDown, { passive: true });
  document.body.style.overflow = 'hidden';
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.body.style.overflow = '';
  };
}, [handleKeyDown]);
```
A `useModal(onClose)` hook would centralize this behavior.
