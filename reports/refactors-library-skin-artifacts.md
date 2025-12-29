# Library Skin Artifacts - Refactoring Report

**Files Analyzed:**
- `src/react/artifacts/stat-chip/stat-chip.library.css`
- `src/react/artifacts/terminal-readout/terminal-readout.library.css`
- `src/react/artifacts/file-manifest/file-manifest.library.css`

**Generated:** 2025-12-29

---

## HIGH Priority

### 1. DRY: Shared Gold Color Tokens (Cross-file)
**Locations:**
- stat-chip.library.css:24-26
- terminal-readout.library.css:27-28
- file-manifest.library.css:24-25

**Issue:** All three files define identical gold colors independently:
```css
/* stat-chip */
--chip-gold: #C9A227;
--chip-gold-deep: #8B6914;
--chip-gold-light: #E8D5A3;

/* terminal-readout */
--terminal-brass: #C9A227;
--terminal-brass-deep: #8B6914;

/* file-manifest */
--manifest-gold: #C9A227;
--manifest-gold-deep: #8B6914;
```

**Refactor:** Create shared library base tokens in a common file:
```css
/* library-base.css */
[data-skin="library"] {
  --lib-gold: #C9A227;
  --lib-gold-deep: #8B6914;
  --lib-gold-light: #E8D5A3;
  --lib-gold-accent: #D4AF37;
}
```
Then alias in each component file.

---

### 2. DRY: Animation Easing Function (Cross-file)
**Locations:**
- stat-chip.library.css:45
- terminal-readout.library.css:48
- file-manifest.library.css:46

**Issue:** Identical cubic-bezier defined 3 times:
```css
cubic-bezier(0.23, 1, 0.32, 1)
```

**Refactor:** Define once in shared base:
```css
[data-skin="library"] {
  --lib-ease: cubic-bezier(0.23, 1, 0.32, 1);
}
```

---

### 3. DRY: Gold Shimmer Gradients (Cross-file)
**Locations:**
- stat-chip.library.css:27-34
- terminal-readout.library.css:29-35
- file-manifest.library.css:26-32

**Issue:** Three nearly identical gold shimmer gradients with slight variations in stops.

**Refactor:** Create parameterized shimmer or single shared definition:
```css
[data-skin="library"] {
  --lib-gold-shimmer: linear-gradient(
    135deg,
    #D4AF37 0%,
    #F5E7A3 25%,
    #C9A227 50%,
    #8B6914 100%
  );
}
```

---

## MEDIUM Priority

### 4. DRY: Cream/Vellum Colors (Cross-file)
**Locations:**
- stat-chip.library.css:19-21
- terminal-readout.library.css:23-24
- file-manifest.library.css:19-21

**Issue:** Near-identical cream colors with different names:
```css
--chip-cream: #F5F1E8;        --chip-cream-warm: #EDE7DA;
--terminal-cream: #F5F1E8;    --terminal-cream-aged: #EDE7DA;
--manifest-vellum: #F8F5EE;   --manifest-vellum-shadow: #EDE8DD;
```

**Refactor:** Consolidate to shared tokens with semantic aliases.

---

### 5. DRY: Ink Colors (Cross-file)
**Locations:**
- stat-chip.library.css:37-38
- terminal-readout.library.css:38-39
- file-manifest.library.css:35-37

**Issue:** Nearly identical ink colors:
```css
--chip-ink: #1A1612;        --chip-ink-soft: #3D352D;
--terminal-ink: #1A1612;    --terminal-ink-faded: #5C5248;
--manifest-ink: #1A1410;    --manifest-ink-faded: #5C5248;
```

**Refactor:** Share base ink token, allow component variation.

---

### 6. DRY: Loading Pulse Animations (Cross-file)
**Locations:**
- stat-chip.library.css:312-315 (`premium-pulse`)
- terminal-readout.library.css:368-371 (`specimen-pulse`)
- file-manifest.library.css:422-425 (`folio-pulse`)

**Issue:** Three animations with identical structure, different opacity values:
```css
@keyframes premium-pulse  { 0%, 100%: 0.5; 50%: 0.8 }
@keyframes specimen-pulse { 0%, 100%: 0.4; 50%: 0.7 }
@keyframes folio-pulse    { 0%, 100%: 0.3; 50%: 0.6 }
```

**Refactor:** Single shared keyframe, use `animation-fill-mode` or opacity modifier via CSS variable.

---

### 7. DRY: Hover Box-Shadow Duplication (Each file)
**Locations:**
- stat-chip.library.css:94-108 vs 118-131
- terminal-readout.library.css:66-78 vs 85-95
- file-manifest.library.css:66-78 vs 85-95

**Issue:** Hover states repeat 90% of base box-shadow, only adding glow effects.

**Refactor:** Extract shadow layers into CSS variables:
```css
--shadow-base: inset 0 1px 0 rgba(255, 255, 255, 0.06)...;
--shadow-gold-glow: 0 0 30px rgba(201, 162, 39, 0.15);

.element { box-shadow: var(--shadow-base); }
.element:hover { box-shadow: var(--shadow-base), var(--shadow-gold-glow); }
```

---

## LOW Priority

### 8. Cleanup: Webkit Prefix
**Location:** stat-chip.library.css:74

**Issue:** Redundant `-webkit-clip-path: none;` following `clip-path: none;`

**Action:** Remove webkit prefix (clip-path well-supported).

---

### 9. Optimization: Grouped Selectors
**Location:** terminal-readout.library.css:264-266

**Issue:** Three separate selectors with identical styling:
```css
[data-skin="library"] .terminal-readout__service--up .terminal-readout__status-text,
[data-skin="library"] .terminal-readout__service--degraded .terminal-readout__status-text,
[data-skin="library"] .terminal-readout__service--down .terminal-readout__status-text {
```

**Refactor:** Use `:is()` selector:
```css
[data-skin="library"] :is(.terminal-readout__service--up, .terminal-readout__service--degraded, .terminal-readout__service--down) .terminal-readout__status-text {
```

---

### 10. Naming Consistency
**Issue:** Token prefixes vary (`--chip-`, `--terminal-`, `--manifest-`) for identical concepts.

**Suggestion:** Consider unified naming for shared concepts:
- `--lib-gold`, `--lib-cream`, `--lib-ink` (shared)
- `--chip-*`, `--terminal-*`, `--manifest-*` (component-specific)

---

## Summary

| Priority | Count | Type |
|----------|-------|------|
| HIGH | 3 | DRY (shared tokens) |
| MEDIUM | 4 | DRY (patterns) |
| LOW | 3 | Cleanup/optimization |
| **Total** | **10** | |

## Recommended Approach

Create a new shared file `library-base.css`:
```
src/react/skins/library-base.css
```

Contains:
- Gold color palette
- Cream/ink palette
- Animation easing
- Gold shimmer gradient
- Shared pulse animation

Each component imports base, then defines component-specific tokens as aliases or overrides.
