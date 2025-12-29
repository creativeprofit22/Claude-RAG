# Refactor Hunt Report - Phase 2 Charts + Admin

**Date**: 2025-12-28
**Feature**: Phase 2 - Charts + Admin Components
**Status**: Complete - 3 findings (1 major, 1 medium, 1 minor)

## Files Analyzed

| File | Lines | Issues |
|------|-------|--------|
| AdminDashboard.tsx | 436 | 1 (shared pattern) |
| DocumentList.tsx | 110 | 0 (clean) |
| RAGInterface.tsx | 225 | 2 (DRY violations) |
| RAGChat.tsx | 177 | 2 (shared pattern, unused import) |
| DocumentLibrary.tsx | 265 | 1 (shared pattern) |

---

## Findings

### 1. [MAJOR] DRY Violation - Error Banner (3 files)

**Priority**: Medium (quality improvement, not blocking)
**Effort**: Low (30 min)

Identical error banner markup appears in 3 components:

**AdminDashboard.tsx:270-278**
```tsx
{error && (
  <div className="curator-error-banner" role="alert">
    <AlertCircle size={16} aria-hidden="true" />
    {error}
    <button className="curator-error-dismiss" onClick={() => setError(null)}>
      <XCircle size={14} />
    </button>
  </div>
)}
```

**RAGChat.tsx:127-140** - Same pattern
**DocumentLibrary.tsx:190-203** - Same pattern

**Recommendation**: Extract to shared component:
```tsx
// src/react/components/shared/ErrorBanner.tsx
export function ErrorBanner({ error, onDismiss }: { error: string; onDismiss: () => void }) {
  return (
    <div className="curator-error-banner" role="alert">
      <AlertCircle size={16} aria-hidden="true" />
      <span>{error}</span>
      <button onClick={onDismiss} className="curator-error-dismiss" aria-label="Dismiss error">
        <X size={14} />
      </button>
    </div>
  );
}
```

---

### 2. [MEDIUM] DRY Violation - Tab Buttons (RAGInterface.tsx)

**Priority**: Low
**Effort**: Low (20 min)
**Location**: RAGInterface.tsx:109-142

Two tab buttons with identical structure and styling logic:

```tsx
<button
  type="button"
  role="tab"
  id="rag-tab-chat"
  aria-selected={activeView === 'chat'}
  className={`rag-interface-tab ${activeView === 'chat' ? 'rag-interface-tab--active' : ''}`}
  onClick={() => setActiveView('chat')}
  style={activeView === 'chat' ? { borderColor: accentColor, color: accentColor } : undefined}
>
  <MessageSquare size={16} aria-hidden="true" />
  <span>Chat</span>
</button>
```

**Recommendation**: Extract to TabButton component or use data-driven rendering:
```tsx
const tabs = [
  { view: 'chat', icon: MessageSquare, label: 'Chat', badge: scopedDocument ? 1 : undefined },
  { view: 'documents', icon: Library, label: 'Documents' },
] as const;
```

---

### 3. [MINOR] Unused Import (RAGChat.tsx)

**Priority**: Low
**Effort**: Trivial (1 min)
**Location**: RAGChat.tsx:5

```tsx
import { Database, X, AlertCircle, type LucideIcon } from 'lucide-react';
//                                   ^^^^^^^^^^^^^^^^ never used
```

**Fix**: Remove `type LucideIcon` from import.

---

## Clean Patterns (No Action Needed)

### AdminDashboard.tsx
- Good component extraction: `StatCard`, `ServiceStatusItem`
- Proper constants: `HEALTH_STATUS_ICONS`, `SKELETON_COUNT`
- Correct AbortController cleanup pattern
- Stable headers memoization to prevent rerenders

### DocumentList.tsx
- Clean, focused component (110 lines)
- Proper skeleton loading with stable keys
- Good accessibility: `aria-busy`, `aria-label`, `role="list"`

### DocumentLibrary.tsx
- Excellent state management via custom hooks
- Clean separation: `useDocuments` for data, `useDocumentLibraryState` for UI
- Proper motion orchestration with staggered children

---

## Summary

| Severity | Count | Action |
|----------|-------|--------|
| Major | 1 | ErrorBanner extraction (optional) |
| Medium | 1 | TabButton DRY (optional) |
| Minor | 1 | Remove unused import |

**Overall Assessment**: Code is well-structured. The DRY violations are quality improvements, not blockers. The ErrorBanner extraction would provide the most value as it affects 3 files.

---

## Next Steps

1. **Optional**: Extract ErrorBanner to `src/react/components/shared/ErrorBanner.tsx`
2. **Optional**: Refactor tab buttons in RAGInterface.tsx
3. **Quick fix**: Remove unused `type LucideIcon` import from RAGChat.tsx
4. **Ready for**: Next phase or build/test cycle
