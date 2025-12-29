# Refactor Hunt: Phase 3 - Modals + Upload Motion System

**Date**: 2025-12-28
**Status**: Complete
**Files Analyzed**: 5
**Validation**: All checks passed (4 bugs fixed prior)

## Files Analyzed

1. `src/react/components/upload/UploadModal.tsx` (237 lines)
2. `src/react/components/documents/DocumentPreview.tsx` (171 lines)
3. `src/react/components/shared/ConfirmDialog.tsx` (109 lines)
4. `src/react/components/upload/FileDropZone.tsx` (175 lines)
5. `src/react/components/upload/FileQueue.tsx` (231 lines)

---

## High Priority

### 1. Triple Filter Loop (FileQueue.tsx:179-181)

**Issue**: Three separate `.filter()` calls iterate the files array.

```tsx
const queuedCount = files.filter((f) => f.status === 'queued').length;
const completedCount = files.filter((f) => f.status === 'complete').length;
const errorCount = files.filter((f) => f.status === 'error').length;
```

**Fix**: Single reduce with object accumulator.

```tsx
const counts = files.reduce(
  (acc, f) => {
    acc[f.status] = (acc[f.status] || 0) + 1;
    return acc;
  },
  {} as Record<string, number>
);
const { queued: queuedCount = 0, complete: completedCount = 0, error: errorCount = 0 } = counts;
```

---

### 2. Inline Functions in Map (FileQueue.tsx:220-221)

**Issue**: New function references created on every render.

```tsx
onRemove={() => onRemove(file.id)}
onRename={onRename ? (name) => onRename(file.id, name) : undefined}
```

**Fix**: Memoize `FileQueueItem` with `React.memo` and pass `file.id` as a prop.

```tsx
const FileQueueItem = React.memo(function FileQueueItem({ file, fileId, onRemove, onRename, isUploading }: FileQueueItemProps) {
  const handleRemove = useCallback(() => onRemove(fileId), [onRemove, fileId]);
  const handleRename = useCallback((name: string) => onRename?.(fileId, name), [onRename, fileId]);
  // ...
});
```

---

## Medium Priority

### 3. Inline Style Objects (DocumentPreview.tsx)

**Issue**: Style objects with `accentColor` recreated every render.

**Locations**:
- Line 70: `style={{ backgroundColor: \`${accentColor}20\`, borderColor: \`${accentColor}40\` }}`
- Line 72: `style={{ color: accentColor }}`
- Line 80: `style={{ backgroundColor: \`${accentColor}20\`, color: accentColor }}`
- Line 158: `style={{ backgroundColor: accentColor }}`

**Fix**: Extract to memoized styles.

```tsx
const accentStyles = useMemo(() => ({
  iconContainer: { backgroundColor: `${accentColor}20`, borderColor: `${accentColor}40` },
  icon: { color: accentColor },
  badge: { backgroundColor: `${accentColor}20`, color: accentColor },
  primaryBtn: { backgroundColor: accentColor },
}), [accentColor]);
```

---

### 4. DEFAULT_ACCEPT Computed Per Render (FileDropZone.tsx:30)

**Issue**: Default parameter spreads and joins arrays on every render.

```tsx
accept = [...SUPPORTED_EXTENSIONS, ...SUPPORTED_MIME_TYPES].join(','),
```

**Fix**: Module-level constant.

```tsx
// At top of file, after imports
const DEFAULT_ACCEPT = [...SUPPORTED_EXTENSIONS, ...SUPPORTED_MIME_TYPES].join(',');

// In props
accept = DEFAULT_ACCEPT,
```

---

### 5. Inconsistent React Import Style (UploadModal.tsx:44, 64)

**Issue**: Mixes `React.useEffect`/`React.useState` with destructured imports.

```tsx
import React, { useCallback, useEffect } from 'react';  // Line 5
// ...
React.useEffect(() => { ... });  // Line 44
const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | null>(null);  // Line 64
```

**Fix**: Use destructured imports consistently.

```tsx
import React, { useCallback, useEffect, useState } from 'react';
// ...
useEffect(() => { ... });
const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
```

---

### 6. Potential Stale Closure (UploadModal.tsx:81-84)

**Issue**: `onAllComplete` callback references `files` from component scope, but this could be stale.

```tsx
onAllComplete: (results) => {
  if (onUploadComplete) {
    const completedFiles = files.filter((f) => f.status === 'complete');  // 'files' could be stale
    onUploadComplete(completedFiles);
  }
},
```

**Fix**: The `results` parameter from `useFileQueue` should already contain the completed files. Use that instead, or refactor `useFileQueue` to pass completed files directly.

---

## Low Priority

### 7. editName Sync Issue (FileQueue.tsx:50-51)

**Issue**: Local `editName` state is initialized from `file.name` but never syncs if prop changes.

```tsx
const [editName, setEditName] = React.useState(file.name);
```

**Fix**: Add sync effect.

```tsx
const [editName, setEditName] = React.useState(file.name);

useEffect(() => {
  if (!isEditing) {
    setEditName(file.name);
  }
}, [file.name, isEditing]);
```

---

## DRY Pattern (Informational)

All 3 modals share identical structure:
- `AnimatePresence` wrapper with `mode="wait"`
- `motion.div` overlay + `motion.div` modal pattern
- `useModal` + `useSkinMotion` hooks
- `onClick={(e) => e.stopPropagation()}` on inner div

**Recommendation**: Leave as-is. A base `ModalBase` component would save ~15 lines per modal but adds abstraction complexity. Not worth it for 3 modals. Revisit if more modals are added.

---

## Summary

| Priority | Count | Items |
|----------|-------|-------|
| High | 2 | Triple filter loop, inline map functions |
| Medium | 4 | Inline styles, DEFAULT_ACCEPT, React imports, stale closure |
| Low | 1 | editName sync |
| **Total** | **7** | |

---

## Recommended Order

1. **FileQueue.tsx** - Triple filter + memoize FileQueueItem (biggest perf win)
2. **FileDropZone.tsx** - DEFAULT_ACCEPT constant (quick fix)
3. **UploadModal.tsx** - Consistent imports + stale closure fix
4. **DocumentPreview.tsx** - Memoize accent styles
5. **FileQueue.tsx** - editName sync (minor)
