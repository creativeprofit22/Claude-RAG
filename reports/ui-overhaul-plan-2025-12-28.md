# Claude-RAG UI Overhaul - Implementation Plan

**Date**: 2025-12-28
**Phase**: Planning Complete
**Next**: Build Phase

---

## Critical Mindset Shift

**Before (Current)**: Styled rectangles with effects
- Rectangular card with clipped corners
- Neon border applied to rectangle
- Texture overlay on rectangle

**After (Target)**: Shaped physical artifacts
- A holographic DATA CHIP that happens to contain stat info
- The chip IS the component - not a card styled to look like one
- 3D transforms, layered elements, physical materials

---

## Part 1: Cyberpunk Stat Card - "Holographic Data Chip"

### 1.1 The Concept

A physical data chip artifact - like a futuristic SD card or memory module:
- **Shape**: Parallelogram with tapered edges, connector pins at bottom
- **Orientation**: Floats at 8-12 degree angle (perspective + rotateY)
- **Layers** (bottom to top):
  1. Shadow/glow projection on surface below
  2. Chip substrate (dark translucent material)
  3. Circuitry pattern (SVG or gradient lines)
  4. Holographic data projection (the actual numbers/text)
  5. Wear layer (scratches, fingerprints, grime)
  6. Scan line overlay
  7. Neon edge bleed

### 1.2 HTML Structure

```html
<!-- Current structure -->
<div class="rag-admin-stat-card">
  <div class="rag-admin-stat-icon">...</div>
  <div class="rag-admin-stat-info">
    <span class="rag-admin-stat-value">1,234</span>
    <span class="rag-admin-stat-label">Documents</span>
  </div>
</div>

<!-- New structure for cyberpunk -->
<article class="stat-chip" data-skin="cyberpunk">
  <!-- Chip body -->
  <div class="stat-chip__body">
    <!-- Circuitry layer -->
    <div class="stat-chip__circuits"></div>

    <!-- Holographic projection zone -->
    <div class="stat-chip__holo">
      <span class="stat-chip__value" data-text="1,234">1,234</span>
      <span class="stat-chip__label">Documents</span>
    </div>

    <!-- Wear and damage -->
    <div class="stat-chip__wear"></div>

    <!-- Icon badge (corner) -->
    <div class="stat-chip__icon">
      <FileText />
    </div>
  </div>

  <!-- Connector pins -->
  <div class="stat-chip__pins"></div>
</article>
```

### 1.3 CSS Architecture

```css
/* ============================================
   CYBERPUNK: Stat Chip Artifact
   ============================================ */

/* SVG texture for circuitry - defined once, referenced everywhere */
:root {
  --circuit-pattern: url("data:image/svg+xml,%3Csvg xmlns='...'%3E...%3C/svg%3E");
  --noise-texture: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

[data-skin="cyberpunk"] .stat-chip {
  /* 3D perspective for the floating effect */
  perspective: 1000px;
  position: relative;
  margin-bottom: 40px; /* Space for shadow projection */
}

[data-skin="cyberpunk"] .stat-chip__body {
  /* The physical chip shape */
  position: relative;
  clip-path: polygon(
    0 8%,           /* Top-left tapered */
    8% 0,           /* Top-left corner */
    92% 0,          /* Top-right corner */
    100% 8%,        /* Top-right tapered */
    100% 85%,       /* Bottom-right before pins */
    85% 100%,       /* Bottom-right taper */
    15% 100%,       /* Bottom-left taper */
    0 85%           /* Bottom-left before pins */
  );

  /* 3D floating transform */
  transform: rotateY(-8deg) rotateX(3deg);
  transform-style: preserve-3d;

  /* Base material */
  background:
    linear-gradient(135deg,
      rgba(0, 20, 30, 0.95) 0%,
      rgba(10, 40, 50, 0.9) 100%
    );

  /* Neon edge */
  box-shadow:
    /* Inner glow */
    inset 0 0 30px rgba(0, 255, 255, 0.15),
    /* Edge bleed */
    0 0 20px rgba(0, 255, 255, 0.5),
    0 0 40px rgba(0, 255, 255, 0.3),
    0 0 60px rgba(0, 255, 255, 0.15);

  /* Border glow */
  border: 1px solid rgba(0, 255, 255, 0.6);

  padding: 1.5rem;
  min-height: 120px;

  transition: transform 0.4s ease;
}

/* Hover: chip tilts more, glow intensifies */
[data-skin="cyberpunk"] .stat-chip:hover .stat-chip__body {
  transform: rotateY(-12deg) rotateX(5deg) translateZ(10px);
  box-shadow:
    inset 0 0 40px rgba(0, 255, 255, 0.25),
    0 0 30px rgba(0, 255, 255, 0.7),
    0 0 60px rgba(0, 255, 255, 0.5),
    0 0 100px rgba(0, 255, 255, 0.3);
}

/* Circuitry layer */
[data-skin="cyberpunk"] .stat-chip__circuits {
  position: absolute;
  inset: 0;
  background:
    /* Horizontal lines */
    repeating-linear-gradient(
      0deg,
      transparent 0px,
      transparent 8px,
      rgba(0, 255, 255, 0.03) 8px,
      rgba(0, 255, 255, 0.03) 9px
    ),
    /* Vertical traces */
    repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 20px,
      rgba(0, 255, 255, 0.02) 20px,
      rgba(0, 255, 255, 0.02) 21px
    );
  opacity: 0.6;
  pointer-events: none;
}

/* Holographic projection zone */
[data-skin="cyberpunk"] .stat-chip__holo {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* The stat value with glitch effect */
[data-skin="cyberpunk"] .stat-chip__value {
  font-family: 'Orbitron', 'Share Tech Mono', monospace;
  font-size: 2.5rem;
  font-weight: 700;
  color: #0ff;
  text-shadow:
    0 0 10px rgba(0, 255, 255, 0.9),
    0 0 20px rgba(0, 255, 255, 0.6),
    0 0 40px rgba(0, 255, 255, 0.4);
  letter-spacing: 0.1em;
  position: relative;
}

/* Glitch text pseudo-elements */
[data-skin="cyberpunk"] .stat-chip__value::before,
[data-skin="cyberpunk"] .stat-chip__value::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0.8;
}

[data-skin="cyberpunk"] .stat-chip__value::before {
  animation: glitch-1 0.3s infinite linear alternate;
  clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
  color: #0ff;
  text-shadow: -2px 0 #f0f;
}

[data-skin="cyberpunk"] .stat-chip__value::after {
  animation: glitch-2 0.3s infinite linear alternate;
  clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
  color: #0ff;
  text-shadow: 2px 0 #f0f;
}

@keyframes glitch-1 {
  0%, 100% { transform: translateX(0); opacity: 0; }
  20% { transform: translateX(-2px); opacity: 0.8; }
  40% { transform: translateX(2px); opacity: 0; }
  60% { transform: translateX(-1px); opacity: 0.8; }
  80% { transform: translateX(1px); opacity: 0; }
}

@keyframes glitch-2 {
  0%, 100% { transform: translateX(0); opacity: 0; }
  25% { transform: translateX(2px); opacity: 0.8; }
  50% { transform: translateX(-2px); opacity: 0; }
  75% { transform: translateX(1px); opacity: 0.8; }
}

/* Label */
[data-skin="cyberpunk"] .stat-chip__label {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(0, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

/* Wear layer - scratches and grime */
[data-skin="cyberpunk"] .stat-chip__wear {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;

  /* Noise texture for surface imperfection */
  background: var(--noise-texture);
  opacity: 0.08;
  mix-blend-mode: overlay;
}

/* Grime in corners */
[data-skin="cyberpunk"] .stat-chip__wear::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 150px 100px at 0% 100%,
      rgba(0, 0, 0, 0.25), transparent 60%),
    radial-gradient(ellipse 100px 80px at 100% 0%,
      rgba(0, 0, 0, 0.15), transparent 50%);
  pointer-events: none;
}

/* Scan lines */
[data-skin="cyberpunk"] .stat-chip__wear::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent 0px,
    transparent 2px,
    rgba(0, 0, 0, 0.15) 2px,
    rgba(0, 0, 0, 0.15) 4px
  );
  pointer-events: none;
}

/* Icon badge */
[data-skin="cyberpunk"] .stat-chip__icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  /* Angular shape */
  clip-path: polygon(
    0 0, calc(100% - 8px) 0, 100% 8px,
    100% 100%, 8px 100%, 0 calc(100% - 8px)
  );

  background: linear-gradient(135deg, #0ff, #f0f);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  color: #0a0a12;
  z-index: 6;
}

/* Connector pins at bottom */
[data-skin="cyberpunk"] .stat-chip__pins {
  position: absolute;
  bottom: -8px;
  left: 20%;
  right: 20%;
  height: 8px;
  display: flex;
  justify-content: space-between;
  gap: 4px;
  z-index: -1;
}

[data-skin="cyberpunk"] .stat-chip__pins::before,
[data-skin="cyberpunk"] .stat-chip__pins::after {
  content: '';
  flex: 1;
  background: linear-gradient(to bottom, #333, #1a1a1a);
  border-radius: 0 0 2px 2px;
}

/* Shadow projection on surface */
[data-skin="cyberpunk"] .stat-chip::before {
  content: '';
  position: absolute;
  bottom: -30px;
  left: 10%;
  right: 10%;
  height: 20px;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 255, 255, 0.3) 0%,
    transparent 70%
  );
  filter: blur(10px);
  transform: rotateX(60deg);
  pointer-events: none;
}
```

### 1.4 React Component Changes

```tsx
// New artifact wrapper component
interface StatChipProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  meta?: string;
  isLoading?: boolean;
}

function StatChip({ icon, value, label, meta, isLoading }: StatChipProps) {
  const displayValue = isLoading ? '---' : String(value);

  return (
    <article className="stat-chip">
      <div className="stat-chip__body">
        <div className="stat-chip__circuits" aria-hidden="true" />

        <div className="stat-chip__holo">
          <span
            className="stat-chip__value"
            data-text={displayValue}
          >
            {displayValue}
          </span>
          <span className="stat-chip__label">{label}</span>
          {meta && <span className="stat-chip__meta">{meta}</span>}
        </div>

        <div className="stat-chip__wear" aria-hidden="true" />

        <div className="stat-chip__icon">
          {icon}
        </div>
      </div>

      <div className="stat-chip__pins" aria-hidden="true" />
    </article>
  );
}
```

---

## Part 2: All Cyberpunk Admin Artifacts

### 2.1 Component Artifact Map

| Component | Current | New Artifact |
|-----------|---------|--------------|
| Stat Cards | Rectangle with clip-path | **Holographic Data Chip** - angled, pins, circuitry |
| Service Health | Status list | **Busted Terminal Readout** - CRT with burn-in, phosphor decay |
| Recent Uploads | File list | **Corrupted File Manifest** - torn paper edge, glitch overlay |
| Panel Container | Rectangle with border | **HUD Frame** - bracket corners, targeting reticle marks |
| Buttons | Styled rectangle | **Circuit Trace Toggle** - path lights up on hover |
| Progress Bars | Filled rectangle | **Power Conduit** - energy flowing through tube |

### 2.2 Service Health - "Busted Terminal Readout"

```
┌────────────────────────────────┐
│ ▓░ SYSTEM_HEALTH.exe          │
├────────────────────────────────┤
│                                │
│  DATABASE    [████████] UP     │  ← Phosphor green text
│  EMBEDDINGS  [████░░░░] SLOW   │  ← Amber for degraded
│  CLAUDE CLI  [████████] OK     │  ← Each line flickers slightly
│  GEMINI API  [░░░░░░░░] DOWN   │  ← Red, with scanline glitch
│                                │
│  ▓ BURN-IN GHOST ▓             │  ← Static text always visible
│                                │
└──[CRT_FRAME]───────────────────┘
    ^^^
    Rounded CRT corners, screen curve effect
```

**CSS Concept**:
- CRT screen curve: `border-radius: 8px / 100px` (asymmetric for bulge)
- Phosphor glow: `text-shadow` with green/amber/red per status
- Burn-in: Fixed text at low opacity that never changes
- Flicker: Random opacity keyframe per line (staggered)
- Scanline: Same pattern as chips but denser

### 2.3 Recent Uploads - "Corrupted File Manifest"

```
╔═══════════════════════════════════╗
║ ▒ FILE MANIFEST // SECTOR 7G     ║
╠═══════════════════════════════════╣
║                                   ║
║  ┌─────────────────────────────┐  ║
║  │ report.pdf     2.4MB  12:34 │──┼─ Torn paper edge
║  │ data█████.csv  ERR   ██:██  │  ║  (random clip-path)
║  │ image.png      892KB 11:02  │  ║
║  └─────────────────────────────┘  ║
║                                   ║
║  [CORRUPTION: 12%] ▓▓▓░░░░░░░░   ║
╚═══════════════════════════════════╝
```

**CSS Concept**:
- Random `clip-path` on some rows (torn edge)
- Occasional character replaced with `█` block
- Glitch animation on corrupted entries
- Status bar showing "corruption level"

### 2.4 Panel Container - "HUD Frame"

```
    ┌──────────────────────────┐
┌───┘                          └───┐
│  ⊕                          ⊕   │  ← Targeting reticles
│  ┌──────────────────────────┐   │
│  │                          │   │
│  │     CONTENT AREA         │   │  ← Inner content zone
│  │                          │   │
│  └──────────────────────────┘   │
│  ⊕                          ⊕   │
└───┐                          ┌───┘
    └──────────────────────────┘
```

**CSS Concept**:
- Stepped corners using `clip-path`
- Corner decorations (⊕) as `::before`/`::after` with icon font or SVG
- Neon edge that pulses subtly
- Inner content has slight padding for "safe zone" feel

---

## Part 3: CSS Architecture for Skin Switching

### 3.1 The Problem

Current approach: Skin-specific overrides bloat skins.css

```css
/* This approach doesn't scale */
[data-skin="cyberpunk"] .stat-card { ... }
[data-skin="library"] .stat-card { ... }
[data-skin="brutalist"] .stat-card { ... }
[data-skin="glass"] .stat-card { ... }
```

### 3.2 The Solution: Artifact Components

Create separate component files per artifact type:

```
src/react/
├── artifacts/
│   ├── stat-chip/
│   │   ├── StatChip.tsx           # React component
│   │   ├── stat-chip.base.css     # Shared structure
│   │   ├── stat-chip.cyberpunk.css
│   │   ├── stat-chip.library.css
│   │   ├── stat-chip.brutalist.css
│   │   └── stat-chip.glass.css
│   ├── terminal-readout/
│   │   ├── TerminalReadout.tsx
│   │   └── ...
│   └── hud-frame/
│       ├── HudFrame.tsx
│       └── ...
```

### 3.3 Skin-Aware Loading

```tsx
// hooks/useSkinStyles.ts
import { useLayoutEffect } from 'react';
import { useSkin } from './useSkin';

export function useSkinStyles(componentName: string) {
  const { currentSkin } = useSkin();

  useLayoutEffect(() => {
    // Dynamically import skin-specific CSS
    import(`../artifacts/${componentName}/${componentName}.${currentSkin}.css`);
  }, [componentName, currentSkin]);
}
```

### 3.4 CSS Custom Property Architecture

```css
/* tokens/artifacts.css - shared artifact tokens */
:root {
  /* Shape tokens */
  --artifact-clip-chip: polygon(0 8%, 8% 0, 92% 0, 100% 8%, 100% 85%, 85% 100%, 15% 100%, 0 85%);
  --artifact-clip-terminal: polygon(4% 0, 96% 0, 100% 4%, 100% 96%, 96% 100%, 4% 100%, 0 96%, 0 4%);
  --artifact-clip-hud: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);

  /* Effect tokens - overridden per skin */
  --artifact-glow-color: transparent;
  --artifact-glow-size: 0px;
  --artifact-texture-opacity: 0;
  --artifact-transform: none;
}

/* Cyberpunk overrides */
[data-skin="cyberpunk"] {
  --artifact-glow-color: rgba(0, 255, 255, 0.5);
  --artifact-glow-size: 30px;
  --artifact-texture-opacity: 0.1;
  --artifact-transform: rotateY(-8deg) rotateX(3deg);
}

/* Library overrides */
[data-skin="library"] {
  --artifact-glow-color: transparent;
  --artifact-glow-size: 0;
  --artifact-texture-opacity: 0.4;
  --artifact-transform: none;
}
```

---

## Part 4: Implementation Spec

### 4.1 Build Order

1. **Stat Chip** (Cyberpunk) - Proof of concept
2. **Terminal Readout** (Cyberpunk) - Service health
3. **HUD Frame** (Cyberpunk) - Panel wrapper
4. **Port to Library skin** - Leather journals, brass gauges
5. **Port to Brutalist skin** - Concrete blocks, industrial meters
6. **Port to Glass skin** - Floating crystals, prisms

### 4.2 File Changes Required

**New Files**:
```
src/react/artifacts/
├── stat-chip/
│   ├── StatChip.tsx
│   ├── stat-chip.base.css
│   └── stat-chip.cyberpunk.css
├── terminal-readout/
│   ├── TerminalReadout.tsx
│   ├── terminal-readout.base.css
│   └── terminal-readout.cyberpunk.css
└── hud-frame/
    ├── HudFrame.tsx
    ├── hud-frame.base.css
    └── hud-frame.cyberpunk.css
```

**Modified Files**:
```
src/react/components/admin/AdminDashboard.tsx
- Import new artifact components
- Replace StatCard with StatChip
- Replace ServiceStatusItem with TerminalReadout entries
- Wrap panels in HudFrame

demo/skins.css
- Extract cyberpunk admin rules to artifact files
- Keep skin color/typography tokens
```

### 4.3 Dependencies

**Required (already installed)**:
- Framer Motion (mount/unmount, hover)
- GSAP + ScrollTrigger (scroll reveals, glitch timelines)

**Recommended addition**:
- `augmented-ui` - For complex clip-paths (optional, can do with pure CSS)

### 4.4 Performance Checklist

- [ ] Use `will-change: transform, opacity` on animated artifacts
- [ ] SVG textures inline as data URIs (no HTTP requests)
- [ ] Limit glitch animations to `:hover` or scroll-triggered
- [ ] Use `@supports` for backdrop-filter fallbacks
- [ ] Scope GSAP with `useGSAP` hook for cleanup
- [ ] Test on low-end devices (reduce effects with `prefers-reduced-motion`)

### 4.5 Accessibility

- [ ] Ensure all artifacts have proper `role` attributes
- [ ] Glitch text must have readable content (not just `data-text`)
- [ ] Color contrast must meet WCAG for text over effects
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Focus states visible through glow effects

---

## Part 5: Success Criteria

### Cyberpunk Admin Panel Checklist

- [ ] Stat cards look like holographic data chips, not rectangles
- [ ] Cards float at an angle with 3D perspective
- [ ] Visible circuitry pattern texture
- [ ] Neon glow that bleeds beyond borders
- [ ] Scanline overlay visible
- [ ] Wear marks (grime in corners, scratches)
- [ ] Glitch effect on stat values (subtle, on hover/scroll)
- [ ] Connector pins visible at bottom of chips
- [ ] User still instantly knows what each stat means

### UX Validation

- [ ] Clickable areas are obvious
- [ ] Numbers are readable despite effects
- [ ] Navigation hierarchy is clear
- [ ] No motion sickness from excessive animation
- [ ] Works on mobile (simplified effects if needed)

---

## Appendix: SVG Textures

### A.1 Circuit Pattern

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
  <defs>
    <pattern id="circuit" patternUnits="userSpaceOnUse" width="100" height="100">
      <!-- Horizontal traces -->
      <line x1="0" y1="20" x2="100" y2="20" stroke="cyan" stroke-width="0.5" opacity="0.3"/>
      <line x1="0" y1="50" x2="100" y2="50" stroke="cyan" stroke-width="0.5" opacity="0.3"/>
      <line x1="0" y1="80" x2="100" y2="80" stroke="cyan" stroke-width="0.5" opacity="0.3"/>

      <!-- Vertical traces -->
      <line x1="25" y1="0" x2="25" y2="100" stroke="cyan" stroke-width="0.5" opacity="0.2"/>
      <line x1="75" y1="0" x2="75" y2="100" stroke="cyan" stroke-width="0.5" opacity="0.2"/>

      <!-- Connection nodes -->
      <circle cx="25" cy="20" r="2" fill="cyan" opacity="0.5"/>
      <circle cx="75" cy="50" r="2" fill="cyan" opacity="0.5"/>
      <circle cx="25" cy="80" r="2" fill="cyan" opacity="0.5"/>
    </pattern>
  </defs>
  <rect width="100" height="100" fill="url(#circuit)"/>
</svg>
```

### A.2 Noise Texture (feTurbulence)

```svg
<svg xmlns="http://www.w3.org/2000/svg">
  <filter id="noise">
    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#noise)"/>
</svg>
```

---

---

## Part 6: Library Skin Artifacts

### 6.1 Stat Cards - "Leather-Bound Journal Entry"

**Concept**: A page from a ledger or journal, with the stat written in calligraphy

```
┌─────────────────────────────────┐
│ ╔═════════════════════════════╗ │  ← Gold embossed border
│ ║                             ║ │
│ ║    1,234                    ║ │  ← Serif number, ink color
│ ║    ─────────                ║ │  ← Flourish underline
│ ║    Documents                ║ │
│ ║                             ║ │
│ ║ [wax seal]                  ║ │  ← Icon as wax seal
│ ╚═════════════════════════════╝ │
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  ← Leather spine
└─────────────────────────────────┘
```

**CSS Concept**:
- Leather texture via feTurbulence (brown tones, low frequency)
- Gold gradient text for values
- Embossed border with inset shadow
- Book spine on left edge (gradient + shadow)
- Wax seal as circular icon with gradient + shadow

### 6.2 Service Health - "Brass Gauge Cluster"

```
    ╭───────────────────────────╮
   /   DATABASE        ◎  ◎    \
  │    ┌─────────────────────┐  │
  │    │     ╱╲              │  │
  │    │    ╱  ╲   HEALTHY   │  │  ← Needle points to status
  │    │   ╱ ●  ╲            │  │
  │    │  ╱      ╲           │  │
  │    └─────────────────────┘  │
   \       ▪▪▪▪▪▪▪▪▪          /
    ╰───────────────────────────╯
         ^^^
         Rivets
```

**CSS Concept**:
- Circular/oval gauges with brass frame
- Needle that rotates based on health (CSS transform: rotate())
- Green/amber/red zones behind needle
- Brass rivets as decorative circles
- Aged metal texture overlay

### 6.3 Recent Uploads - "Card Catalog Drawer"

```
┌────────────────────────────────────┐
│ ╔══════════════════════════════╗   │
│ ║  □ report.pdf     2.4MB     ║   │  ← Cards with tab dividers
│ ╠══════════════════════════════╣   │
│ ║  □ data.csv       1.1MB     ║   │
│ ╠══════════════════════════════╣   │
│ ║  □ image.png      892KB     ║   │
│ ╚══════════════════════════════╝   │
│  ╭────────────────────────────╮    │
│  │       PULL HANDLE          │    │  ← Brass drawer pull
│  ╰────────────────────────────╯    │
└────────────────────────────────────┘
```

**CSS Concept**:
- Index cards stacked with visible tabs
- Paper texture background
- Brass drawer pull at bottom (decorative)
- Typewriter font for file names
- Ink stamp effect for metadata

---

## Part 7: Brutalist Skin Artifacts

### 7.1 Stat Cards - "Concrete Counter Block"

**Concept**: A massive concrete block with stamped numbers, like counting blocks at a construction site

```
┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓┃  ← Hazard stripe header
┣━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                        ┃
┃   1,234                ┃  ← Stencil font, outlined
┃   ━━━━━━━━━━           ┃
┃   DOCUMENTS            ┃  ← Stamped, all caps
┃                        ┃
┃                   [▣]  ┃  ← Icon in square frame
┗━━━━━━━━━━━━━━━━━━━━━━━━┛
████████████████████████████  ← Hard offset shadow (black block)
```

**CSS Concept**:
- Concrete noise texture (high frequency feTurbulence)
- HARD offset shadow (8px 8px 0 black, no blur)
- Stencil/stamped text (-webkit-text-stroke, hollow)
- Hazard stripes header (repeating-linear-gradient 45deg)
- No border-radius ever
- Thick black borders (4px+)

### 7.2 Service Health - "Factory Warning Lights"

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ▓▓ SYSTEM STATUS ▓▓           ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                ┃
┃  DATABASE     [●] ON           ┃  ← Big chunky indicator light
┃  EMBEDDINGS   [○] STANDBY      ┃  ← Hollow = off
┃  CLAUDE CLI   [●] ON           ┃
┃  GEMINI API   [✕] FAULT        ┃  ← X = error
┃                                ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**CSS Concept**:
- Industrial indicator lights (circles with hard shadows)
- ON = filled circle, OFF = hollow, FAULT = X
- Monospace stamped labels
- No transitions (instant state changes)
- Physical push-button aesthetic

### 7.3 Recent Uploads - "Factory Punch Cards"

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ ╔══════════════════════════════════╗┃
┃ ║●●○●○●●○ report.pdf    ●●○○●○●●○ ║┃  ← Punch holes = data
┃ ╠══════════════════════════════════╣┃
┃ ║●○●●○○●● data.csv      ○●●○●●○○● ║┃
┃ ╠══════════════════════════════════╣┃
┃ ║○●●○●●●○ image.png     ●○○●●○●●○ ║┃
┃ ╚══════════════════════════════════╝┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**CSS Concept**:
- Punch card aesthetic with decorative holes
- Holes as small circles (filled = ●, empty = ○)
- Card stock paper color (#f5f0e0)
- Thick card edges
- Mechanical sorting vibe

---

## Part 8: Glass Skin Artifacts

### 8.1 Stat Cards - "Floating Crystal Shard"

**Concept**: A crystal or prism that floats and refracts light

```
        ╱╲
       ╱  ╲
      ╱    ╲         ← Prismatic top edge
     ╱ 1,234 ╲
    ╱  ──────  ╲     ← Value inside crystal
   ╱ Documents  ╲
  ╱              ╲
 ╱________________╲
        ▽            ← Crystal point
```

**CSS Concept**:
- `clip-path: polygon()` for crystal facets
- `backdrop-filter: blur(20px)` for glass effect
- Rainbow gradient at edges (prismatic refraction)
- Subtle floating animation (translateY oscillation)
- Light caustics on hover (shifting gradient)
- Inner shadow for depth

### 8.2 Service Health - "Glowing Orb Cluster"

```
    ○               ← Floating orbs
      ◐         ○   ← Partially lit = degraded
  ○       ●         ← Filled = healthy, empty = down
       ○      ◐
```

**CSS Concept**:
- Spherical gradients (radial-gradient with highlight spot)
- Floating animation (different phases per orb)
- Glow intensity = health level
- Color: green = healthy, amber = degraded, dim = down
- Soft blur halos

### 8.3 Recent Uploads - "Bubble Cluster"

```
    ╭─────────────╮
   ╱               ╲
  │  report.pdf    │      ← File info inside bubble
  │  2.4MB         │
   ╲               ╱
    ╰─────────────╯
         ↑
    Rainbow shimmer on edge
```

**CSS Concept**:
- Pill-shaped containers with blur
- Rainbow gradient border (animated rotation)
- Soft shadow + glow
- Gentle scale on hover (breathing effect)

---

## Next Session: Build Phase

Command for next chat:
```
Continue Claude-RAG UI Overhaul at /home/reaver47/Documents/Claude-RAG

**Read these files:**
1. HANDOFF-UI-OVERHAUL.md - Original vision
2. reports/ui-overhaul-research-2025-12-28.md - Research findings
3. reports/ui-overhaul-plan-2025-12-28.md - This implementation plan

**Phase**: Build

**This Session**:
1. Create artifact directory structure
2. Build StatChip component (Cyberpunk skin first)
3. Integrate into AdminDashboard
4. Test and iterate

DO NOT deviate from the plan. Build exactly what's specified.
```
