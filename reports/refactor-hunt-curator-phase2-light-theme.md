# Refactor Hunt Report: Curator Design System - Phase 2 Light Theme

**Date**: 2025-12-26
**Files Analyzed**:
- `src/react/tokens/colors.css` (227 lines)
- `src/react/tokens/index.css` (102 lines)
- `src/react/styles.css` (2798 lines)

---

## Summary

| Priority | Count | Categories |
|----------|-------|------------|
| High     | 3     | DRY violations, pattern extraction |
| Medium   | 5     | Naming consistency, dead code |
| Low      | 3     | Minor cleanup, comments |

---

## High Priority

### H1. Repeated Modal Overlay Pattern (3 occurrences)

**File**: `styles.css`
**Lines**: 776-787, 1164-1175, 1429-1438

**Problem**: Three identical modal overlay implementations:

```css
/* .rag-preview-overlay (776-787) */
/* .rag-confirm-overlay (1164-1175) */
/* .rag-upload-modal-overlay (1429-1438) */
```

All share:
- `position: fixed; inset: 0;`
- `display: flex; align-items: center; justify-content: center;`
- `background-color: var(--curator-overlay-bg);`
- `backdrop-filter: blur(4px);`
- `animation: curator-fade-in 0.15s ease-out;`

**Fix**: Extract to shared `.curator-overlay` base class.

---

### H2. Repeated Error Banner Pattern (3 occurrences)

**File**: `styles.css`
**Lines**: 388-412, 1089-1114, 2181-2206

**Problem**: Three nearly identical error banner implementations:
- `.rag-error-banner` + `.rag-error-dismiss`
- `.rag-library-error` + `.rag-library-error-dismiss`
- `.rag-admin-error` + `.rag-admin-error-dismiss`

**Fix**: Extract to shared `.curator-error-banner` component.

---

### H3. Duplicate Animation Declaration

**File**: `styles.css`
**Lines**: 206-207, 312, 315-318

**Problem**: `curator-bounce` animation applied redundantly:

```css
/* Line 206-207 */
.rag-loading-dots span {
  animation: curator-bounce 1s infinite;
}

/* Line 312 */
.rag-typing-dot {
  animation: curator-bounce 1s infinite;
}

/* Lines 315-318 - DUPLICATE */
.rag-loading-dots span,
.rag-typing-dot {
  animation: curator-bounce 1s infinite;
}
```

**Fix**: Remove lines 315-318 (redundant rule).

---

## Medium Priority

### M1. Inconsistent BEM Modifier Syntax

**File**: `styles.css`

**Problem**: Mixed modifier conventions:
- Double-dash: `.rag-interface-tab--active` (line 1342)
- Single-dash: `.rag-doc-card-selected` (line 601)

**Other examples**:
- `.rag-doc-sort-chevron-open` (line 498) - single-dash
- `.rag-doc-sort-option-active` (line 534) - single-dash

**Fix**: Standardize on double-dash (`--`) for state modifiers.

---

### M2. Light Theme Border Derivation Inconsistency

**File**: `colors.css`
**Lines**: 45-49 vs 165-169

**Problem**:
- Dark theme borders derive from `--curator-cream` using `oklch(from var(...))`:
  ```css
  --curator-border-subtle: oklch(from var(--curator-cream) l c h / 0.08);
  ```
- Light theme borders use hardcoded values:
  ```css
  --curator-border-subtle: oklch(0.20 0.01 50 / 0.06);
  ```

**Fix**: Define `--curator-border-base` in light theme and derive variants consistently.

---

### M3. Dead Empty `:root` Block

**File**: `styles.css`
**Lines**: 10-13

**Problem**: Empty `:root` block serves no purpose:

```css
:root {
  /* Legacy variables now mapped in tokens/colors.css */
}
```

**Fix**: Remove entirely.

---

### M4. Repeated Empty State Pattern (3 occurrences)

**File**: `styles.css`
**Lines**: 94-126, 737-773, 1125-1158

**Problem**: Similar flex-center + text styling repeated:
- `.rag-empty-state` + `.rag-empty-*`
- `.rag-doc-list-empty` + `.rag-doc-list-empty-*`
- `.rag-library-empty` + `.rag-library-empty-*`

**Fix**: Extract to shared `.curator-empty-state` component.

---

### M5. Hardcoded Values Instead of Tokens

**File**: `styles.css`

**Problem**: Many hardcoded values should use token variables:

| Hardcoded | Count | Token Suggestion |
|-----------|-------|------------------|
| `border-radius: 0.5rem` | ~50 | `--curator-radius-md` |
| `border-radius: 0.75rem` | ~30 | `--curator-radius-lg` |
| `font-size: 0.75rem` | ~40 | `--curator-text-xs` |
| `font-size: 0.875rem` | ~35 | `--curator-text-sm` |
| `gap: 0.5rem` | ~30 | `--curator-gap-sm` |
| `gap: 0.75rem` | ~25 | `--curator-gap-md` |

**Note**: This is a larger refactor that may span multiple phases.

---

## Low Priority

### L1. `--curator-gold-hover` Uses Literal Value

**File**: `colors.css`
**Lines**: 36, 156

**Problem**: Unlike other derived variants, uses literal oklch instead of `oklch(from ...)`:

```css
--curator-gold-hover: oklch(0.65 0.18 74 / 0.20);  /* literal */
--curator-gold-muted: oklch(from var(--curator-gold) l c h / 0.15);  /* derived */
```

**Fix**: Change to derived pattern for consistency.

---

### L2. Universal Scrollbar Selector

**File**: `index.css`
**Lines**: 91-94

**Problem**: Applies scrollbar styling to all elements:

```css
* {
  scrollbar-width: thin;
  scrollbar-color: var(--curator-border-light) transparent;
}
```

**Fix**: Move to `html` or `:root` since scrollbar styling inherits.

---

### L3. TODO Comments Still Present

**File**: `colors.css`
**Lines**: 27, 98-99

**Problem**: Phase 2 TODO comments remain:
- Line 27: `/* TODO Phase 2: For disabled states... */`
- Lines 98-99: `/* TODO Phase 2: For CSS noise/grain overlays... */`

**Fix**: Resolve or remove if Phase 2 is complete.

---

## Deferred (Future Phases)

### D1. Button/Interactive Base Class Extraction

**File**: `styles.css`

Many button-like elements share patterns:
- `background-color: var(--curator-bg-subtle)`
- `border: 1px solid var(--curator-border-light)`
- `cursor: pointer`
- `transition: var(--curator-transition-all)`

Could extract: `.curator-btn-base`, `.curator-btn-ghost`, `.curator-btn-primary`

**Why Deferred**: Larger refactor requiring component updates.

---

### D2. Card/Panel Base Class Extraction

**File**: `styles.css`

Similar patterns in:
- `.rag-doc-card`
- `.rag-source-item`
- `.rag-preview-chunk`
- `.rag-admin-panel`

Could extract: `.curator-card`, `.curator-panel`

**Why Deferred**: Requires significant restructuring.

---

## Recommended Execution Order

1. **H3** - Remove duplicate animation (1 min, safe)
2. **M3** - Remove dead `:root` block (1 min, safe)
3. **L3** - Resolve/remove TODO comments (2 min)
4. **H1** - Extract modal overlay pattern
5. **H2** - Extract error banner pattern
6. **M4** - Extract empty state pattern
7. **M1** - Standardize BEM modifiers
8. **M2** - Light theme border derivation
9. **L1** - Gold hover derivation
10. **L2** - Scrollbar selector optimization

---

## Validation Checklist

After each refactor:
- [ ] `npm run build` passes
- [ ] `npm run typecheck` passes
- [ ] Visual regression check (dark + light themes)
- [ ] Modal overlays render correctly
- [ ] Error banners display correctly
- [ ] Empty states display correctly
