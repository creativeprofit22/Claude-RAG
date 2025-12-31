# Refactoring Report: Library Desk Layout

**Feature**: Library Desk Layout
**Files Analyzed**: RAGChat.tsx, src/react/styles.css, demo/styles.css
**Date**: 2025-12-30

---

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| HIGH     | 0     | - |
| MEDIUM   | 3     | Unused imports, dead CSS code |
| LOW      | 2     | Magic numbers, minor cleanup |

**Total**: 5 refactoring opportunities

---

## MEDIUM Priority

### M1. Unused Type Import in RAGChat.tsx
**File**: `src/react/RAGChat.tsx:4`
**Issue**: `type LucideIcon` is imported but never used in the component
**Current**:
```tsx
import { Database, type LucideIcon } from 'lucide-react';
```
**Fix**: Remove unused type import
```tsx
import { Database } from 'lucide-react';
```
**Impact**: Cleaner imports, smaller bundle (tree-shaking)

---

### M2. Empty CSS Rule Block
**File**: `src/react/styles.css:224-226`
**Issue**: `.rag-chat--desk-layout` rule is empty (only has a comment)
**Current**:
```css
.rag-chat--desk-layout {
  /* Override default column layout */
}
```
**Fix**: Either add actual styles or remove the empty rule
**Recommendation**: Remove it - the class exists for specificity targeting but adds no value as an empty rule. The comment can move to the section header.
**Impact**: Cleaner CSS, reduced file size

---

### M3. Dead Legacy Variables in Demo Styles
**File**: `demo/styles.css:34-40`
**Issue**: Legacy compatibility variables are defined but never referenced
**Current**:
```css
/* Legacy compatibility - map old names to skin variables */
--leather-dark: var(--skin-accent-dark);
--leather-medium: var(--skin-accent-muted);
--leather-light: var(--skin-border-color);
--parchment: var(--skin-accent);
--aged-paper: var(--skin-accent);
--brass: var(--skin-primary);
--brass-bright: var(--skin-primary-bright);
```
**Verification**: Grep for `var(--leather`, `var(--parchment`, `var(--aged-paper`, `var(--brass)` returns 0 matches
**Fix**: Remove unused legacy variable definitions
**Impact**: Cleaner CSS, reduced confusion about which variables to use

---

## LOW Priority

### L1. Hardcoded Min-Height Magic Numbers
**Files**: `src/react/styles.css:231,275,3077`
**Issue**: Min-height values are hardcoded instead of using CSS variables
**Locations**:
- Line 231: `min-height: 500px;` (`.rag-desk`)
- Line 275: `min-height: 300px;` (`.rag-desk-paper` mobile)
- Line 3077: `min-height: 600px;` (`[data-skin="library"] .rag-desk`)

**Recommendation**: SKIP - These values are intentionally different per context (base vs library skin vs mobile). Adding variables would add complexity without benefit.

---

### L2. Unused Variable in EmptyState Component
**File**: `src/react/components/shared/EmptyState.tsx:35-38`
**Issue**: `iconStyle` object is created but never used
**Current**:
```tsx
const iconStyle = {
  ...(iconColor && { color: iconColor }),
  ...(iconShadow && { boxShadow: iconShadow }),
};
// Then line 43 applies styles directly instead:
<Icon size={iconSize} style={iconColor ? { color: iconColor } : undefined} />
```
**Fix**: Remove unused `iconStyle` variable (lines 35-38)
**Impact**: Cleaner code, removes dead logic

---

## Skipped / Not Issues

### Duplicate Media Queries
**Location**: Two `@media (max-width: 900px)` blocks in styles.css
**Reason for Skip**: They serve different purposes - one for base layout (lines 264-277), one for library skin specifics (lines 3122-3133). Consolidating would reduce clarity.

### --curator-* Variables in Demo
**Location**: demo/styles.css uses `--curator-gold`, `--curator-bg-subtle`
**Reason for Skip**: These are properly defined in tokens/colors.css and are the canonical variable names. The "curator" naming is intentional (the design system's primary accent).

---

## Execution Order

1. **M1** - Remove unused LucideIcon import (RAGChat.tsx)
2. **M2** - Remove empty CSS rule (styles.css)
3. **M3** - Remove legacy variables (demo/styles.css)
4. **L2** - Remove unused iconStyle variable (EmptyState.tsx)
5. **L1** - SKIP (low value)

**Estimated effort**: ~5 minutes for all fixes
