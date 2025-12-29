# Claude-RAG UI Overhaul - Research Report

**Date**: 2025-12-28
**Phase**: Research Complete
**Next**: Planning Phase

---

## Executive Summary

This report synthesizes comprehensive research on implementing skeuomorphic, "lived-in" UI aesthetics for 4 themed skins. Research covered concepts, techniques, and real-world GitHub implementations from 2025.

**Key Findings**:
1. **Skeuomorphism is back** - but evolved into "skeuomorphic minimalism" - strategic texture, not literal realism
2. **GSAP + Framer Motion** work together cleanly when scoped to separate elements
3. **SVG feTurbulence** is the most performant texture approach (2-3KB, GPU-accelerated)
4. **clip-path polygon** enables non-rectangular components with smooth animations
5. **augmented-ui** library provides production-ready cyberpunk clip-path components

---

## Part 1: Universal Techniques

### 1.1 GSAP + Framer Motion Combined (Production Pattern)

**Best Practice**: Use `useGSAP` hook from `@gsap/react` for automatic cleanup.

```tsx
// From: cloudflare/agents, react-bits
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

function AnimatedSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP for scroll-based animations
  useGSAP(() => {
    gsap.to('.fade-in-later', {
      autoAlpha: 1,
      y: 0,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        once: true,
      }
    });
  }, { scope: containerRef });

  // Framer Motion for UI state animations
  return (
    <div ref={containerRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Click me
      </motion.button>
      <div className="fade-in-later">Scroll revealed content</div>
    </div>
  );
}
```

**Division of Labor**:
| Use Framer Motion For | Use GSAP For |
|----------------------|--------------|
| Hover/tap states | Scroll-triggered reveals |
| Layout animations | Complex timelines |
| Mount/unmount | Text character animations |
| Gesture recognition | Performance-critical (100+ elements) |

### 1.2 SVG Texture Overlays (Noise/Grain)

**Most Performant Approach**: Inline SVG filter with pseudo-element overlay.

```css
/* Define once, use everywhere */
.textured::after {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.15;
  mix-blend-mode: overlay;
  pointer-events: none;
  z-index: 1;
}
```

**feTurbulence Parameters**:
- `baseFrequency`: 0.01-0.1 (lower = larger pattern)
- `numOctaves`: 1-5 (higher = more detail, worse performance)
- `type`: "fractalNoise" (smooth) or "turbulence" (rippled)

### 1.3 Non-Rectangular Components (clip-path)

**From Shopify/dawn - Dynamic blob shapes**:
```css
:root {
  --shape--blob-1: 49% 51% 48% 52% / 57% 44% 56% 43%;
  --shape--blob-2: 47% 53% 44% 56% / 36% 50% 50% 64%;
  --shape--blob-3: 46% 54% 50% 50% / 35% 38% 62% 65%;
}

.card {
  clip-path: polygon(var(--shape--blob-1));
}

/* Animated clip-path (same point count required) */
@keyframes morph {
  0% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
  50% { clip-path: polygon(0 0, 100% 0, 80% 100%, 20% 100%); }
  100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
}
```

---

## Part 2: Cyberpunk Skin (PRIORITY)

### 2.1 Holographic Data Chips

**augmented-ui Library** (Recommended):
```bash
npm install augmented-ui
```

```html
<div data-augmented-ui="tl-clip tr-clip bl-clip br-clip border">
  <h3>System Status</h3>
  <span class="stat">98.7%</span>
</div>
```

```css
.data-chip {
  --aug-tl-clip: 15px;
  --aug-tr-clip: 15px;
  --aug-bl-clip: 15px;
  --aug-br-clip: 15px;
  --aug-border: 2px solid #0ff;
  --aug-border-bg: rgba(0, 255, 255, 0.05);
  background: rgba(0, 20, 30, 0.9);
}
```

### 2.2 Glitch Effects

**From codrops/CSSGlitchEffect**:
```css
.glitch-text {
  position: relative;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
}

.glitch-text::before {
  animation: glitch-anim-1 0.3s infinite linear alternate;
  clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
  text-shadow: -2px 0 #0ff;
}

.glitch-text::after {
  animation: glitch-anim-2 0.3s infinite linear alternate;
  clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
  text-shadow: 2px 0 #f0f;
}

@keyframes glitch-anim-1 {
  0% { clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%); }
  20% { clip-path: polygon(0 15%, 100% 15%, 100% 20%, 0 20%); }
  40% { clip-path: polygon(0 10%, 100% 10%, 100% 25%, 0 25%); }
  60% { clip-path: polygon(0 30%, 100% 30%, 100% 35%, 0 35%); }
  80% { clip-path: polygon(0 40%, 100% 40%, 100% 50%, 0 50%); }
  100% { clip-path: polygon(0 20%, 100% 20%, 100% 30%, 0 30%); }
}
```

### 2.3 Neon Glow (Bleeding Effect)

```css
.neon-element {
  color: #0ff;
  text-shadow:
    0 0 10px #0ff,
    0 0 20px #0ff,
    0 0 40px #0ff,
    0 0 80px #00ffff;
  filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.8));
}

/* Flickering neon */
@keyframes neon-flicker {
  0%, 100% { opacity: 1; }
  5% { opacity: 0.8; }
  10% { opacity: 1; }
  15% { opacity: 0.6; }
  20% { opacity: 1; }
}
```

### 2.4 Scanline Overlay

```css
.crt-scanlines::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.3) 0px,
    rgba(0, 0, 0, 0.3) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 10;
}
```

### 2.5 Wear and Grime

```css
.worn-tech {
  position: relative;
}

/* Grime in corners */
.worn-tech::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 200px 150px at top left,
      rgba(0, 0, 0, 0.15), transparent 70%),
    radial-gradient(ellipse 200px 150px at bottom right,
      rgba(0, 0, 0, 0.2), transparent 70%);
  pointer-events: none;
}

/* Scratch texture */
.worn-tech::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 2px,
    rgba(255, 255, 255, 0.03) 2px,
    rgba(255, 255, 255, 0.03) 4px
  );
  mix-blend-mode: overlay;
  pointer-events: none;
}
```

---

## Part 3: Library Skin

### 3.1 Leather Texture

```css
.leather-surface {
  background: linear-gradient(135deg, #3d2817, #5c4a3a);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -2px 5px rgba(0, 0, 0, 0.5);
  filter: contrast(1.2) brightness(0.95);
}

/* Add grain via pseudo-element with feTurbulence */
.leather-surface::after {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.08' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.1;
  mix-blend-mode: multiply;
  pointer-events: none;
}
```

### 3.2 Embossed/Debossed Text

```css
/* Embossed (raised) */
.embossed-text {
  color: #d7dee1;
  text-shadow:
    -2px -2px 1px rgba(255, 255, 255, 0.6),
    3px 3px 3px rgba(0, 0, 0, 0.4);
}

/* Debossed (inset) */
.debossed-text {
  color: #d7dee1;
  text-shadow:
    0 2px 3px rgba(255, 255, 255, 0.3),
    0 -1px 2px rgba(0, 0, 0, 0.2);
}
```

### 3.3 Gold Foil Effect

```css
.gold-foil {
  background: linear-gradient(
    to right,
    #462523 0%,
    #cb9b51 22%,
    #f6e27a 45%,
    #f6f2c0 50%,
    #f6e27a 55%,
    #cb9b51 78%,
    #462523 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}
```

### 3.4 Page Turn Animation

```css
.flip-container {
  perspective: 1000px;
}

.flipper {
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flip-container:hover .flipper {
  transform: rotateY(180deg);
}

.front, .back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.back {
  transform: rotateY(180deg);
}
```

---

## Part 4: Brutalist Skin

### 4.1 Core Rules

```css
/* NO ROUNDED CORNERS EVER */
* {
  border-radius: 0 !important;
}

/* Hard offset shadows (no blur) */
.brutal-element {
  border: 2px solid #000;
  box-shadow: 4px 4px 0px #333;
}

/* NO smooth transitions */
.brutal-element {
  transition: none !important;
}
```

### 4.2 Concrete Texture

```css
.concrete {
  background: #888;
  position: relative;
}

.concrete::after {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.05' numOctaves='5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.2;
  mix-blend-mode: multiply;
  pointer-events: none;
}
```

### 4.3 Hazard Stripes

```css
.hazard-stripe {
  background: repeating-linear-gradient(
    45deg,
    #FFD700,
    #FFD700 10px,
    #000000 10px,
    #000000 20px
  );
}
```

### 4.4 Stamped Text

```css
.stamped-text {
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke-width: 2px;
  -webkit-text-stroke-color: #000;
}
```

### 4.5 Mechanical Animation

```css
/* Use steps() for mechanical feel */
@keyframes mechanical-slide {
  0% { transform: translateX(0); }
  100% { transform: translateX(100px); }
}

.mechanical {
  animation: mechanical-slide 200ms steps(4);
}
```

---

## Part 5: Glass Skin

### 5.1 Glassmorphism Foundation

```css
.glass-panel {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
}

/* Fallback for unsupported browsers */
@supports not (backdrop-filter: blur(20px)) {
  .glass-panel {
    background: rgba(30, 30, 30, 0.9);
  }
}
```

### 5.2 Prism/Crystal Shapes

```css
.prism {
  clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.diamond {
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

.hexagon {
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}
```

### 5.3 Floating Orbs

```css
.orb {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 255, 255, 0.8),
    transparent 70%
  );
  box-shadow:
    0 0 60px rgba(100, 200, 255, 0.8),
    0 0 100px rgba(100, 200, 255, 0.5),
    inset -20px -20px 60px rgba(0, 0, 0, 0.2);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30px); }
}
```

### 5.4 Blur-to-Focus Reveal

```css
@keyframes blur-reveal {
  0% {
    opacity: 0;
    filter: blur(20px);
  }
  100% {
    opacity: 1;
    filter: blur(0);
  }
}

.reveal-on-load {
  animation: blur-reveal 1.5s ease-out forwards;
}
```

---

## Part 6: Key GitHub Repos Found

### Animation Libraries
| Repo | What We Found |
|------|---------------|
| `DavidHDev/react-bits` | useGSAP patterns, SplitText, Shuffle, FadeContent |
| `cloudflare/agents` | Framer Motion + GSAP combined in same component |
| `motiondivision/motion` | Official useGSAP benchmarks |
| `vitejs/vite` | useSlideIn composable with ScrollTrigger |

### UI Patterns
| Repo | What We Found |
|------|---------------|
| `Shopify/dawn` | Dynamic blob clip-path shapes |
| `codrops/CSSGlitchEffect` | Production glitch animations |
| `tjy-gitnub/win12` | backdrop-filter: blur patterns |
| `yesiamrocks/cssanimation` | Glitch keyframe library |

### Texture/Effects
| Repo | What We Found |
|------|---------------|
| `glittercowboy/plugin-freedom-system` | feTurbulence inline data URIs for knobs/toggles |
| `AmKreta/svgEditor` | Splash effects with feTurbulence + feDisplacementMap |
| `moloch--/RootTheBox` | Terminal CRT effects |

---

## Part 7: Recommended Approach Per Skin

### Cyberpunk (Build First)
1. Install `augmented-ui` for clip-path components
2. Create SVG filter definitions for noise/scanlines
3. Build glitch animation keyframes
4. Layer: base → texture → grime → scanlines → glow

### Library (Second)
1. Create leather/parchment texture SVG filters
2. Build emboss/deboss utility classes
3. Add gold foil text utility
4. Implement page-turn animations with perspective

### Brutalist (Third)
1. Global reset: `border-radius: 0`, `transition: none`
2. Create concrete texture overlay
3. Build hard offset shadow system
4. Add stamped text and hazard stripe utilities

### Glass (Fourth)
1. Glassmorphism base component
2. Floating orb background system
3. Blur-reveal animation utilities
4. Crystal clip-path shapes

---

## Part 8: Performance Checklist

### DO:
- Use `will-change: transform, opacity` on animated elements
- Use SVG feTurbulence for textures (GPU-accelerated)
- Scope GSAP animations with `useGSAP` hook
- Use `steps()` for mechanical animations (brutalist)
- Add `@supports` fallbacks for backdrop-filter

### DON'T:
- Animate `box-shadow` (very expensive)
- Animate `backdrop-filter` directly (use opacity wrapper)
- Use more than 10 blur layers per viewport
- Forget cleanup in useEffect (use useGSAP instead)
- Skip `-webkit-backdrop-filter` prefix

---

## Part 9: Libraries to Consider

| Library | Use Case | Size |
|---------|----------|------|
| `augmented-ui` | Cyberpunk clip-path | ~15KB |
| `@gsap/react` | useGSAP hook | Part of GSAP |
| `gsap` | Complex animations | ~23KB |
| `framer-motion` | React animations | ~32KB |

**Already in project**: GSAP, Framer Motion, ScrollTrigger

**Recommended addition**: `augmented-ui` for cyberpunk skin

---

## Next Steps (Planning Phase)

1. Review this research with user
2. Design Cyberpunk admin stat cards as proof of concept
3. Define component shapes for each artifact
4. Create texture/animation system architecture
5. Plan CSS custom property extensions for skins

---

## Sources

### Wave 1 (Concepts)
- Skeuomorphic Minimalism: justinmind.com, uiverse.io, medium.com
- GSAP + Framer Motion: semaphore.io, pentaclay.com, tharakasachin98.medium.com
- Grainy Gradients: css-tricks.com, ibelick.com, freecodecamp.org
- Blade Runner UI: territorystudio.com, hudsandguis.com
- Ghost in the Shell: hudsandguis.com
- Deus Ex Aesthetics: gamedeveloper.com, pc2000s.substack.com

### Wave 2 (GitHub)
- github.com/DavidHDev/react-bits
- github.com/cloudflare/agents
- github.com/vitejs/vite
- github.com/Shopify/dawn
- github.com/codrops/CSSGlitchEffect
- github.com/yesiamrocks/cssanimation
- github.com/tjy-gitnub/win12
