# Claude-RAG Design System: Rare Books Library Aesthetic

A component design system that moves beyond generic rounded rectangles to create distinctive, scholarly UI components evoking rare book archives, Victorian libraries, and Art Deco geometric precision.

---

## Design Philosophy

**Problem Solved:** Every SaaS looks the same because every component is a rounded rectangle. This design system introduces:
- Geometric clip-path shapes (notched corners, diagonal cuts, hexagonal edges)
- Decorative borders (double-line frames, brass accents, ornamental edges)
- Depth through shadows (inset bevels, embossed effects, layered depth)
- Scholarly textures (aged paper, leather tones, serif typography)

---

## Color Tokens (Library Palette)

```css
:root {
  /* Leather & Parchment */
  --leather-dark: #3C241E;
  --leather-medium: #654321;
  --leather-light: #8B4513;
  --parchment: #F4E8D0;
  --aged-paper: #FFFACD;

  /* Brass & Gold */
  --brass: #B87333;
  --brass-bright: #CD7F32;
  --gold-accent: #D4AF37;

  /* Depth Shadows */
  --shadow-emboss: inset 0 1px 0 rgba(255,255,255,0.2);
  --shadow-carved: inset 0 2px 4px rgba(0,0,0,0.15);
  --shadow-lift: 0 4px 12px rgba(0,0,0,0.15);
}
```

---

## 1. BUTTON DESIGNS

### 1.1 Notched Corner Button (Art Deco)
Hexagonal corner cuts using clip-path for geometric precision.

```css
.btn-notched {
  position: relative;
  padding: 0.75rem 1.5rem;
  background: var(--curator-gold);
  color: var(--curator-bg-deep);
  border: none;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;

  /* Hexagonal corner cuts */
  clip-path: polygon(
    8px 0,           /* Top-left notch */
    100% 0,
    100% calc(100% - 8px),  /* Bottom-right notch */
    calc(100% - 8px) 100%,
    0 100%,
    0 8px            /* Top-left approach */
  );

  transition: all 0.15s ease-out;
}

.btn-notched:hover {
  background: var(--curator-gold-bright);
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 var(--leather-dark);
}

.btn-notched:active {
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0 var(--leather-dark);
}
```

### 1.2 Beveled 3D Button (Skeuomorphic)
Multi-layer shadows create embossed appearance.

```css
.btn-beveled {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(to bottom, var(--brass-bright), var(--brass));
  border: 2px solid var(--leather-dark);
  border-radius: 2px;
  color: var(--parchment);
  font-weight: 600;
  cursor: pointer;

  /* Embossed effect */
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.4),  /* Top highlight */
    inset 0 -1px 0 rgba(0,0,0,0.2),        /* Bottom shadow */
    0 2px 4px rgba(0,0,0,0.2);             /* Drop shadow */

  transition: all 0.1s ease-out;
}

.btn-beveled:hover {
  background: linear-gradient(to bottom, #D4955C, var(--brass-bright));
}

.btn-beveled:active {
  box-shadow:
    inset 0 2px 4px rgba(0,0,0,0.3),  /* Pressed in */
    0 1px 2px rgba(0,0,0,0.1);
}
```

### 1.3 Stamp/Seal Button
Asymmetric border-radius for organic seal appearance.

```css
.btn-stamp {
  padding: 1rem 1.5rem;
  background: radial-gradient(circle at 30% 30%, var(--brass-bright), var(--brass));
  border: 2px solid var(--leather-dark);
  border-radius: 50% 8px 50% 8px;  /* Asymmetric organic shape */
  color: var(--parchment);
  font-weight: 600;
  transform: rotate(-2deg);
  cursor: pointer;

  box-shadow:
    0 4px 12px rgba(0,0,0,0.25),
    inset 0 1px 0 rgba(255,255,255,0.3);

  transition: all 0.2s ease;
}

.btn-stamp:hover {
  transform: rotate(-2deg) scale(1.05);
  box-shadow:
    0 6px 16px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.4);
}
```

---

## 2. CARD/CONTAINER DESIGNS

### 2.1 Index Card (Library Catalog)
Evokes physical index cards with ruled lines.

```css
.card-index {
  background: var(--aged-paper);
  border: 2px solid var(--leather-light);
  border-radius: 2px;
  padding: 1rem 1.25rem;
  position: relative;
  font-family: 'Courier New', monospace;

  box-shadow:
    0 2px 8px rgba(0,0,0,0.1),
    inset 0 0 0 1px rgba(0,0,0,0.05);
}

/* Ruled line at top */
.card-index::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: repeating-linear-gradient(
    90deg,
    var(--leather-light) 0px,
    var(--leather-light) 40px,
    transparent 40px,
    transparent 50px
  );
}

/* Divider line */
.card-index-divider {
  border: none;
  border-bottom: 1px solid var(--leather-light);
  margin: 0.75rem 0;
}
```

### 2.2 Diagonal Cut Container (Art Deco)
Polygon clip-path creates angled edges.

```css
.card-diagonal {
  background: var(--curator-bg-subtle);
  border: 2px solid var(--curator-border-light);
  padding: 1.5rem;
  position: relative;

  /* Angled bottom-right corner */
  clip-path: polygon(
    0 0,
    100% 0,
    100% calc(100% - 20px),
    calc(100% - 20px) 100%,
    0 100%
  );

  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Gold accent corner decoration */
.card-diagonal::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, transparent 50%, var(--gold-accent) 50%);
  pointer-events: none;
}
```

### 2.3 Double-Border Frame (Victorian)
Outline + border creates double-line frame effect.

```css
.card-framed {
  background: var(--curator-bg-surface);
  border: 2px solid var(--leather-light);
  outline: 2px solid var(--leather-light);
  outline-offset: 4px;
  padding: 1.5rem;
  margin: 8px; /* Space for outline */

  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}

.card-framed:hover {
  border-color: var(--brass);
  outline-color: var(--brass);
}
```

### 2.4 Book Spine Container (Vertical)
Writing-mode for vertical text display.

```css
.card-spine {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  background: linear-gradient(135deg, var(--leather-dark), var(--leather-medium));
  border: 2px solid var(--leather-dark);
  padding: 1rem 0.5rem;
  min-height: 200px;
  width: 60px;

  color: var(--parchment);
  font-family: var(--curator-font-serif);
  font-weight: 600;

  box-shadow:
    -3px 0 8px rgba(0,0,0,0.2),
    inset 1px 0 0 rgba(255,255,255,0.1);
}

.card-spine:hover {
  transform: translateX(-5px);
  box-shadow:
    -6px 0 12px rgba(0,0,0,0.25),
    inset 1px 0 0 rgba(255,255,255,0.15);
}
```

### 2.5 Stacked Paper Effect
Multiple box-shadows create paper stack illusion.

```css
.card-stacked {
  background: var(--parchment);
  border: 1px solid var(--leather-light);
  padding: 1.5rem;
  position: relative;

  box-shadow:
    0 1px 3px rgba(0,0,0,0.1),
    4px 4px 0 -1px var(--parchment),
    4px 4px 0 0 var(--leather-light),
    8px 8px 0 -1px var(--parchment),
    8px 8px 0 0 var(--leather-light);
}
```

---

## 3. INPUT FIELD DESIGNS

### 3.1 Ledger Line Input (Accounting Style)
Underline-only with thickening on focus.

```css
.input-ledger {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--curator-border-light);
  padding: 0.5rem 0;
  font-family: var(--curator-font-mono);
  font-size: 0.875rem;
  color: var(--curator-text-primary);
  width: 100%;

  transition: border-color 0.2s ease, border-width 0.2s ease;
}

.input-ledger:focus {
  outline: none;
  border-bottom: 2px solid var(--curator-gold);
}

.input-ledger::placeholder {
  color: var(--curator-text-muted);
  font-style: italic;
}
```

### 3.2 Inset Carved Input (Skeuomorphic)
Inset shadow creates recessed appearance.

```css
.input-carved {
  background: var(--curator-bg-subtle);
  border: 1px solid var(--curator-border-light);
  border-radius: 2px;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: var(--curator-text-primary);

  box-shadow:
    inset 0 2px 4px rgba(0,0,0,0.08),
    inset 0 1px 2px rgba(0,0,0,0.04);

  transition: all 0.2s ease;
}

.input-carved:focus {
  outline: none;
  border-color: var(--curator-gold);
  box-shadow:
    inset 0 2px 4px rgba(0,0,0,0.1),
    0 0 0 3px var(--curator-gold-subtle);
}
```

### 3.3 Brass Accent Input
Left border accent with focus glow.

```css
.input-brass-accent {
  background: var(--curator-bg-surface);
  border: 1px solid var(--curator-border-light);
  border-left: 3px solid var(--brass);
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: var(--curator-text-primary);

  transition: all 0.2s ease;
}

.input-brass-accent:focus {
  outline: none;
  border-color: var(--brass);
  background: var(--curator-bg-hover);
  box-shadow: 0 0 0 3px rgba(184, 115, 51, 0.15);
}
```

### 3.4 Terminal/Typewriter Input
Monospace font with cursor blink effect.

```css
.input-typewriter {
  background: var(--curator-bg-deep);
  border: 1px solid var(--curator-border-medium);
  padding: 0.75rem 1rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: var(--curator-gold);
  caret-color: var(--curator-gold);

  transition: all 0.2s ease;
}

.input-typewriter:focus {
  outline: none;
  border-color: var(--curator-gold);
  box-shadow: 0 0 8px rgba(212, 175, 55, 0.2);
}

.input-typewriter::placeholder {
  color: var(--curator-text-muted);
}
```

---

## 4. BORDER & SEPARATOR PATTERNS

### 4.1 Ornamental Rule (Victorian Divider)
Decorative horizontal separator.

```css
.divider-ornamental {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
}

.divider-ornamental::before,
.divider-ornamental::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--brass) 20%,
    var(--brass) 80%,
    transparent
  );
}

.divider-ornamental-center {
  color: var(--brass);
  font-size: 1.25rem;
}
```

### 4.2 Double-Line Border
Creates classic double-border frame.

```css
.border-double {
  border: 2px solid var(--leather-light);
  position: relative;
  padding: 1.5rem;
}

.border-double::before {
  content: '';
  position: absolute;
  inset: 4px;
  border: 1px solid var(--leather-light);
  pointer-events: none;
}
```

### 4.3 Corner Ornament Border
Decorative corner flourishes.

```css
.border-corners {
  border: 1px solid var(--curator-border-light);
  position: relative;
  padding: 1.5rem;
}

/* Top-left corner */
.border-corners::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  width: 20px;
  height: 20px;
  border-top: 3px solid var(--brass);
  border-left: 3px solid var(--brass);
}

/* Bottom-right corner */
.border-corners::after {
  content: '';
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  border-bottom: 3px solid var(--brass);
  border-right: 3px solid var(--brass);
}
```

---

## 5. TYPOGRAPHY PATTERNS

### 5.1 Chapter Heading (Scholarly)
```css
.heading-chapter {
  font-family: var(--curator-font-serif);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--curator-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;

  display: flex;
  align-items: center;
  gap: 1rem;
}

.heading-chapter::before {
  content: '';
  flex: 0 0 40px;
  height: 2px;
  background: var(--brass);
}
```

### 5.2 Archival Label (Metadata)
```css
.label-archival {
  font-family: var(--curator-font-mono);
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--leather-medium);
  background: var(--parchment);
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--leather-light);
}
```

---

## 6. SHADOW PATTERNS

### 6.1 Lift Shadow (Hover State)
```css
.shadow-lift {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}

.shadow-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}
```

### 6.2 Neo-Brutalist Shadow
```css
.shadow-brutal {
  box-shadow: 4px 4px 0 var(--leather-dark);
  transition: all 0.1s ease;
}

.shadow-brutal:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--leather-dark);
}

.shadow-brutal:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 var(--leather-dark);
}
```

---

## 7. IMPLEMENTATION GUIDE

### Priority Order for Demo Update:

1. **Buttons** - Replace `.btn-primary` with `.btn-notched` for primary actions
2. **Cards** - Add `.card-framed` to document cards and message bubbles
3. **Inputs** - Use `.input-carved` for main chat input
4. **Dividers** - Add `.divider-ornamental` between sections
5. **Labels** - Use `.label-archival` for metadata displays

### Files to Update:
- `/demo/styles.css` - Demo-specific component overrides
- `/dist/react/styles.css` - Core component library styles

---

## 8. BEFORE/AFTER COMPARISON

### Generic Button (Before):
```css
.btn-primary {
  padding: 0.75rem 1.5rem;
  background: var(--accent);
  border: none;
  border-radius: 8px;
  color: white;
}
```

### Distinctive Button (After):
```css
.btn-primary {
  padding: 0.75rem 1.5rem;
  background: var(--curator-gold);
  border: 2px solid var(--leather-dark);
  clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
  color: var(--curator-bg-deep);
  box-shadow: 4px 4px 0 var(--leather-dark);
  transition: all 0.15s ease-out;
}

.btn-primary:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--leather-dark);
}
```

The difference: SHAPE becomes a design element, not just color/padding.

---

## Attribution

Research compiled from GitHub production codebases including:
- jonasschmedtmann/advanced-css-course (Natours)
- zombieFox/nightTab
- opera-gaming/gxmods
- DavidHDev/react-bits
- 1j01/jspaint (Windows 98/Bubblegum themes)
- simeydotme/pokemon-cards-css
- IanLunn/Hover
