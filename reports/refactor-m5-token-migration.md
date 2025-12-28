# Refactoring Report: M5 Token Migration

Date: 2025-12-27
Files Analyzed: styles.css, tokens/*.css

## Summary

| Tier | Count | Categories |
|------|-------|------------|
| HIGH | 3 | DRY violations with high impact |
| MEDIUM | 5 | Pattern inconsistencies, missing tokens |
| LOW | 4 | Naming, minor cleanup |

---

## HIGH Priority

### H1. Button Pattern Duplication (DRY)
**Location**: styles.css - 7 button-like classes
**Issue**: Multiple button classes duplicate the same padding/border/radius/transition patterns instead of extending `.curator-btn`.

**Affected classes**:
- `.rag-sources-toggle` (lines 343-355)
- `.rag-doc-sort-trigger` (lines 568-580)
- `.rag-preview-btn` (lines 1030-1040)
- `.rag-confirm-btn` (lines 1246-1250)
- `.rag-upload-modal-btn` (lines 1490-1500)
- `.rag-settings-test-btn` (lines 2595-2608)
- `.rag-api-config-btn` (lines 2708-2722)

**Recommendation**: Create semantic button variant classes that extend `.curator-btn`:
```css
/* Add to shared patterns section */
.curator-btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: var(--curator-text-sm);
  border-radius: var(--curator-radius-md);
}

.curator-btn-xs {
  padding: 0.25rem 0.5rem;
  font-size: var(--curator-text-sm);
  border-radius: 0.25rem;
}
```

**Impact**: ~120 lines of CSS could be consolidated

---

### H2. Input Field Pattern Duplication (DRY)
**Location**: styles.css - 4 input-like classes
**Issue**: Input fields share identical patterns (background, border, radius, focus state) but are written independently.

**Affected classes**:
- `.rag-chat-input` (lines 455-477)
- `.rag-doc-search-input` (lines 537-556)
- `.rag-settings-input` (lines 2556-2574)
- `.rag-upload-queue-item-input` (lines 1779-1792)

**Recommendation**: Create base input class:
```css
.curator-input {
  background-color: var(--curator-bg-subtle);
  border: 1px solid var(--curator-border-light);
  border-radius: var(--curator-radius-lg);
  font-size: var(--curator-text-base);
  color: var(--curator-text-primary);
  outline: none;
  transition: var(--curator-transition-all);
}

.curator-input::placeholder {
  color: var(--curator-text-muted);
}

.curator-input:focus {
  border-color: var(--curator-border-medium);
}
```

**Impact**: ~50 lines of CSS could be consolidated

---

### H3. Missing Token: font-size 0.8125rem (DRY)
**Location**: styles.css - 25 occurrences
**Issue**: The value `font-size: 0.8125rem` (13px) appears 25 times but has no design token.

**Occurrences** (sample):
- `.curator-btn-ghost` (line 122)
- `.rag-interface-scope-name` (line 1361)
- `.rag-upload-queue-item-name` (line 1752)
- `.rag-admin-service-header` (line 2387)
- `.rag-settings-description` (line 2526)

**Recommendation**: Add to typography.css:
```css
--curator-text-md: 0.8125rem;  /* 13px - between sm and base */
```

Then replace all 25 occurrences with `var(--curator-text-md)`.

**Impact**: 25 replacements, improved consistency

---

## MEDIUM Priority

### M1. Remaining Hardcoded border-radius Values
**Location**: styles.css
**Issue**: 41 hardcoded border-radius values remain after M5 migration.

| Value | Count | Token Available |
|-------|-------|-----------------|
| 0.375rem | 29 | `--curator-radius-md` |
| 0.25rem | 12 | `--curator-radius-sm` |

**Recommendation**: Replace in M6 migration phase.

---

### M2. Remaining Hardcoded gap Values
**Location**: styles.css
**Issue**: 31 hardcoded gap values remain.

| Value | Count | Token Available |
|-------|-------|-----------------|
| 0.25rem | 16 | `--curator-gap-xs` |
| 0.375rem | 15 | None (6px) |

**Recommendation**:
1. Add `--curator-gap-1-5: var(--curator-space-1-5);` to spacing.css
2. Replace in M6 migration phase.

---

### M3. Inconsistent Hover State Patterns
**Location**: styles.css - throughout
**Issue**: Three different hover patterns are used:

**Pattern A**: `:hover:not(:disabled)` + filter
```css
.curator-btn-primary:hover:not(:disabled) {
  filter: brightness(1.1);
}
```

**Pattern B**: `:hover:not(:disabled)` + background change
```css
.curator-btn-ghost:hover:not(:disabled) {
  background-color: var(--curator-bg-hover);
}
```

**Pattern C**: `:hover` without disabled check
```css
.rag-doc-sort-trigger:hover {
  background-color: var(--curator-bg-hover);
}
```

**Recommendation**: Standardize on Pattern B for most buttons. Only use filter for primary/accent buttons where color blending is desired.

---

### M4. Inconsistent Focus Ring Styles
**Location**: styles.css
**Issue**: Focus styles vary across components:

```css
/* Pattern A - outline with accent var */
.rag-sources-toggle:focus-visible {
  outline: 2px solid var(--curator-accent, #6366f1);
  outline-offset: 2px;
}

/* Pattern B - using gold token */
.rag-doc-sort-order:focus-visible {
  outline: 2px solid var(--curator-accent, #6366f1);
  outline-offset: 2px;
}
```

Note: Both use a fallback `#6366f1` (indigo) which doesn't match the gold design system.

**Recommendation**:
1. Remove the fallback or change to gold: `var(--curator-gold)`
2. The global `:focus-visible` in index.css already uses `--curator-gold`

---

### M5. Inconsistent BEM Modifier Naming
**Location**: styles.css
**Issue**: Mixed modifier patterns:

**BEM double-dash (preferred)**:
- `.rag-dropdown-chevron--open`
- `.rag-doc-card--selected`
- `.rag-interface-tab--active`

**Single class modifier**:
- `.rag-upload-queue-item.complete`
- `.rag-settings-result.success`
- `.rag-upload-dropzone.dragging`

**Recommendation**: Standardize on BEM convention:
- `.rag-upload-queue-item--complete`
- `.rag-settings-result--success`
- `.rag-upload-dropzone--dragging`

---

## LOW Priority

### L1. Legacy RAG Prefix Variables (Dead Code Candidate)
**Location**: colors.css, lines 113-127
**Issue**: Legacy `--rag-*` variable mappings preserved for backward compatibility.

```css
--rag-bg-primary: var(--curator-bg-deep);
--rag-text-primary: var(--curator-text-primary);
/* ... 12 more */
```

**Recommendation**:
1. Search codebase for `--rag-` variable usage
2. If unused, remove in future cleanup
3. If used, document migration path

---

### L2. Typography Utility Classes (Verify Usage)
**Location**: typography.css, lines 190-218
**Issue**: Utility classes marked as "public API" but usage should be verified:
- `.curator-serif`
- `.curator-sans`
- `.curator-mono`
- `.curator-content`
- `.curator-ui`
- `.curator-overline`

**Recommendation**: Grep for usage. If external API, document. If unused, consider deprecation notice.

---

### L3. Unused Animation Utility Classes
**Location**: animation.css, lines 264-316
**Issue**: 13 animation utility classes defined but need usage verification:
- `.curator-animate-place-down`
- `.curator-animate-scale-in`
- `.curator-animate-glow`
- `.curator-animate-shake`
- `.curator-animate-bounce`
- etc.

**Recommendation**: Same as L2 - verify usage, document API, or deprecate.

---

### L4. Duplicate @supports Blocks
**Location**: animation.css, lines 218-258
**Issue**: Three separate `@supports (transition-behavior: allow-discrete)` blocks could be consolidated.

**Current**:
```css
@supports (transition-behavior: allow-discrete) {
  .rag-message { ... }
  @starting-style { .rag-message { ... } }
}

@supports (transition-behavior: allow-discrete) {
  .rag-preview-modal, .rag-confirm-dialog, .rag-upload-modal { ... }
  @starting-style { ... }
}

@supports (transition-behavior: allow-discrete) {
  .rag-doc-card { ... }
}
```

**Recommendation**: Consolidate into single block:
```css
@supports (transition-behavior: allow-discrete) {
  .rag-message { ... }
  .rag-preview-modal, .rag-confirm-dialog, .rag-upload-modal { ... }
  .rag-doc-card { ... }

  @starting-style {
    .rag-message { ... }
    .rag-preview-modal, .rag-confirm-dialog, .rag-upload-modal { ... }
  }
}
```

---

## Execution Order

1. **H3** - Add `--curator-text-md` token (foundational for H1, H2)
2. **H1** - Create button size variants, refactor button classes
3. **H2** - Create base input class, refactor input fields
4. **M3** - Standardize hover patterns during H1/H2 refactor
5. **M4** - Fix focus ring fallback values
6. **M5** - Rename BEM modifiers (breaking change - coordinate with React)
7. **M1, M2** - Queue for M6 migration
8. **L1-L4** - Address in cleanup phase

---

## Notes

- All HIGH items can be done without breaking changes
- M5 (BEM naming) requires coordinating CSS class names with React components
- L1-L3 require codebase search to verify usage before removal
