# Claude-RAG UI Overhaul - Handoff Document

**Created**: 2025-12-28
**Project**: /home/reaver47/Documents/Claude-RAG
**Status**: Ready for Research Phase

---

## Vision Summary

Transform generic card-based UI into **skeuomorphic artifacts** that embody each skin's world. Components should BE objects from that universe, not styled rectangles.

**Design Philosophy**: "Lived-in" / "Used Future" aesthetic
- Not clean, sterile, Apple-style
- Worn, textured, imperfect - like real objects that have been used
- Blade Runner, Alien, classic Winamp skins energy
- Wild visually BUT grounded in UX - users must still understand what to click

---

## The 4 Skins (Current State → Target State)

### Cyberpunk (PRIORITY - Build First)
**Current**: Teal/cyan rectangles with neon borders. Generic.
**Target**: Holographic data chips, HUD elements, terminal readouts
- Scratches, wear marks, grime in corners
- Neon glow that bleeds and flickers (imperfect)
- Scanline overlays with occasional glitch
- Burn-in effects on displays
- Components look like busted tech from a back-alley shop

### Library
**Current**: Brown boxes on brown. No texture. Boring.
**Target**: Book spines, wax-sealed envelopes, leather journals, card catalog drawers
- Leather grain texture
- Embossed/debossed gold leaf effects
- Paper texture, aged parchment
- Components feel like physical library artifacts

### Brutalist
**Current**: Black/white wireframes. Reads as "unfinished" not "intentional."
**Target**: Concrete blocks, industrial gauges, punch cards, factory manifests
- Concrete/noise texture
- Aggressive offset shadows (physically displaced feel)
- Bolts, rivets, industrial hardware aesthetic
- Stamped typography

### Glass
**Current**: Purple gradient. No actual glass effect.
**Target**: Floating crystals, prisms, water droplets, bubbles
- Real backdrop-blur
- Light refraction effects
- Floating gradient orbs in background
- Frosted edges that catch light

---

## Tech Stack (LOCKED - Do Not Change)

- **Framer Motion**: Mount/unmount, hover/tap, layout animations
- **GSAP + ScrollTrigger**: Scroll reveals, complex timelines, text effects
- **GSAP TextPlugin**: Character-by-character animations (glitch text, typewriter)
- **Pure CSS**: Textures, clip-paths, filters, custom properties
- **NO Tailwind**: Decision made - staying with CSS custom property system

---

## Current Architecture

### File Structure
```
/home/reaver47/Documents/Claude-RAG/
├── demo/skins.css              # 4 theme definitions (~1700 lines)
├── demo/styles.css             # Demo page styles
├── src/react/tokens/
│   ├── colors.css              # OKLCH palette + skin bridge
│   ├── typography.css          # Font stacks
│   ├── spacing.css             # 4px grid system
│   └── animation.css           # Timing, easing, keyframes
├── src/react/styles.css        # Component styles (~2800 lines)
└── src/react/motion/
    ├── gsap-init.ts            # GSAP setup (initialized but UNUSED)
    ├── variants/               # Framer Motion configs per skin
    └── hooks/useSkinMotion.ts  # Returns skin-aware motion config
```

### Skin System
- Activated via `data-skin` attribute on body
- CSS variables: `--skin-*` (per skin) → `--curator-*` (tokens)
- Each skin has ~50+ CSS variables

### Known Issues to Fix
1. `accentColor` prop drilling bypasses skin system (10+ components)
2. Inline styles in ChatInput, MessageBubble, AdminDashboard
3. GSAP installed but not actually used anywhere
4. No texture overlays currently implemented

---

## Research Phase Requirements

### Objective
Find modern (2025, ideally December 2025) implementation patterns for:
1. Skeuomorphic UI components in React
2. "Used future" / cyberpunk texture techniques (CSS/SVG)
3. GSAP + Framer Motion combined animation patterns
4. Clip-path based component shapes (non-rectangular)
5. Texture overlays (noise, grain, scanlines, scratches)

### Tools to Use
- **Grep MCP**: Search GitHub for real-world implementations
- Focus on: clip-path generators, SVG texture overlays, GSAP ScrollTrigger patterns, skeuomorphic React components

### Search Queries to Run
```
- "clip-path polygon" + "react component"
- "cyberpunk UI" + "CSS" + "2025"
- "skeuomorphic" + "react" + "framer-motion"
- "GSAP ScrollTrigger" + "react" + "useEffect"
- "SVG noise texture overlay"
- "CSS scanline effect"
- "holographic UI CSS"
- "worn texture CSS filter"
```

### Output Expected
A research report with:
1. Best patterns found for each technique
2. Code snippets from real repos
3. Recommended approach for Claude-RAG
4. Any libraries worth considering

---

## Phase Plan

### Phase 1: Research (This Handoff)
- New chat session
- Deploy explore agents with Grep MCP
- Find 2025 patterns for skeuomorphic + GSAP + Framer Motion
- Output: Research report with code examples

### Phase 2: Planning
- New chat session
- Take research findings
- Design implementation plan for Cyberpunk skin first
- Define component shapes, textures, animations
- Output: Detailed implementation spec

### Phase 3: Build
- New chat session
- Implement Cyberpunk skin overhaul
- Start with admin panel stat cards as proof of concept
- Iterate based on feedback

---

## Reference Aesthetic

**Cyberpunk Influences**:
- Blade Runner (rain, neon, grime)
- Ghost in the Shell (holographic interfaces)
- Deus Ex (gold/black, augmented UI)
- Old Winamp skins (shaped like physical objects)

**Key Texture Elements**:
- Scratches and wear marks
- Subtle dirt/grime accumulation
- Scan line imperfections
- Neon that flickers/glitches
- Burn-in on displays
- Not pristine - lived in

**UX Constraint**:
Wild design, but users MUST still understand:
- What's clickable
- What's a stat/number
- What's a list
- Navigation and hierarchy

---

## Files to Reference

For current implementation understanding:
- `demo/skins.css` - Current skin definitions
- `src/react/components/admin/AdminDashboard.tsx` - Stat cards to redesign
- `src/react/motion/variants/cyberpunk.ts` - Current Framer Motion config
- `src/react/motion/gsap-init.ts` - GSAP setup

For design report from previous session:
- `reports/ui-design-overhaul-options.md`

---

## Success Criteria

Cyberpunk admin panel where:
1. Stat cards look like holographic data chips (not rectangles)
2. Visible texture: scratches, wear, imperfection
3. Neon glow bleeds and occasionally flickers
4. Scanline overlay visible
5. GSAP scroll reveal with glitch effect
6. User still instantly knows what each stat means

---

## All 4 Skins - Artifact Concepts & Research

**Priority Order**: Cyberpunk (extreme) → Library → Brutalist → Glass (each progressively builds on learnings)

### SKIN 1: Cyberpunk (EXTREME)

**Artifact Concepts**:
| Component | Artifact Shape |
|-----------|----------------|
| Stat cards | Holographic data chips at angle |
| Service health | Terminal readout with scan lines |
| Upload list | Corrupted file manifest |
| Buttons | Circuit traces that light up |
| Progress bars | Power conduit filling |
| Modals | Floating HUD panel |

**Textures**: Scratches, burn-in, grime, fingerprints on glass, worn edges
**Effects**: Neon bleed, flicker, glitch, scanlines, chromatic aberration
**Animation**: Glitch-wipe in, text typing with errors, malfunction hovers

**Research Queries**:
```
- "cyberpunk HUD UI CSS"
- "holographic card CSS clip-path"
- "neon glow bleed CSS"
- "scanline overlay CSS"
- "glitch effect GSAP"
- "chromatic aberration CSS filter"
```

---

### SKIN 2: Library (WARM, TACTILE)

**Artifact Concepts**:
| Component | Artifact Shape |
|-----------|----------------|
| Stat cards | Book spines standing upright OR wax-sealed envelopes |
| Service health | Brass gauge meters |
| Upload list | Open ledger with handwritten entries |
| Buttons | Embossed leather tabs |
| Progress bars | Ink filling a quill reservoir |
| Modals | Wooden card catalog drawer sliding out |

**Textures**: Leather grain, paper fiber, gold leaf, wax seal, aged parchment, wood grain
**Effects**: Emboss/deboss, subtle gold shimmer, page turn shadows
**Animation**: Page turn reveals, ink spreading, stamp press

**Research Queries**:
```
- "leather texture CSS"
- "embossed text CSS"
- "paper texture overlay"
- "book page turn animation CSS"
- "gold foil effect CSS"
- "vintage UI skeuomorphic"
```

---

### SKIN 3: Brutalist (RAW, INDUSTRIAL)

**Artifact Concepts**:
| Component | Artifact Shape |
|-----------|----------------|
| Stat cards | Concrete blocks with stamped numbers OR industrial gauges |
| Service health | Factory warning lights (on/off) |
| Upload list | Punch cards or factory manifest on clipboard |
| Buttons | Physical toggle switches or push buttons |
| Progress bars | Industrial meter with needle |
| Modals | Steel plate bolted over content |

**Textures**: Concrete noise, rust spots, metal scratches, hazard stripes
**Effects**: Hard offset shadows (physically displaced), no rounded corners ever
**Animation**: Hard stamp (instant, no easing), mechanical slide, toggle click

**Research Queries**:
```
- "brutalist web design 2025"
- "concrete texture CSS"
- "industrial UI components"
- "mechanical switch CSS"
- "offset shadow CSS brutal"
- "factory dashboard UI"
```

---

### SKIN 4: Glass (ETHEREAL, FLOATING)

**Artifact Concepts**:
| Component | Artifact Shape |
|-----------|----------------|
| Stat cards | Floating crystals or prisms |
| Service health | Glowing orbs (color = status) |
| Upload list | Bubbles containing file info |
| Buttons | Water droplets that ripple |
| Progress bars | Light beam filling |
| Modals | Frosted glass pane sliding in |

**Textures**: Light refraction, rainbow caustics, frosted edges, subtle gradient mesh
**Effects**: Real backdrop-blur, prismatic light scatter, soft glow halos
**Animation**: Float drift, blur-to-focus reveal, ripple on interact, gentle bob

**Research Queries**:
```
- "glassmorphism 2025 CSS"
- "crystal UI CSS"
- "backdrop-filter blur"
- "prismatic light CSS"
- "floating animation Framer Motion"
- "water ripple effect CSS"
```

---

## Research Phase - Full Query List

For Grep MCP agent, search these patterns:

**Universal (all skins)**:
```
- "clip-path polygon react"
- "skeuomorphic UI 2025"
- "GSAP ScrollTrigger react useEffect"
- "Framer Motion GSAP together"
- "SVG texture overlay component"
- "CSS custom properties theming"
```

**Cyberpunk-specific**:
```
- "cyberpunk UI github"
- "holographic CSS"
- "glitch effect animation"
- "scanline CSS overlay"
```

**Library-specific**:
```
- "leather texture CSS SVG"
- "emboss deboss CSS"
- "vintage skeuomorphic UI"
```

**Brutalist-specific**:
```
- "brutalist web design components"
- "industrial dashboard UI"
- "concrete texture CSS"
```

**Glass-specific**:
```
- "glassmorphism advanced"
- "frosted glass CSS"
- "prismatic effect CSS"
```

---

## Command for New Chat

```
Continue Claude-RAG UI Overhaul at /home/reaver47/Documents/Claude-RAG

Read HANDOFF-UI-OVERHAUL.md for full context.

**This Session**: Research Phase ONLY (Two Waves of Agents)

---

**WAVE 1: Research Agents (Concepts & Techniques)**

Deploy explore agents to research and understand:
- Skeuomorphic UI design principles and patterns
- "Used future" / "lived-in" aesthetic techniques
- How to combine GSAP + Framer Motion effectively
- Texture overlay approaches (CSS, SVG, canvas)
- Non-rectangular component shapes (clip-path, SVG masks)

Per-skin concepts:
1. CYBERPUNK: Holographic interfaces, glitch aesthetics, neon lighting, wear/grime
2. LIBRARY: Victorian tactile design, leather/paper materials, embossing, gold leaf
3. BRUTALIST: Industrial design, concrete/metal materials, mechanical components
4. GLASS: Crystal/prism optics, light refraction, advanced blur techniques

---

**WAVE 2: Grep MCP Agents (GitHub Code - 2025 ONLY)**

After Wave 1 completes, deploy NEW agents using Grep MCP tool (mcp__grep__searchGitHub).

CRITICAL: Filter for 2025 code. Ideally December 2025. We want the latest patterns, not outdated stuff.

Search for actual implementations:
- clip-path polygon components
- GSAP ScrollTrigger + React hooks
- Framer Motion + GSAP combined
- CSS texture overlays (noise, grain, scanlines)
- Glitch/holographic effects
- Glassmorphism with backdrop-filter
- Emboss/deboss CSS techniques

---

**Output**: Combined research report with:
- Concepts understood (from Wave 1)
- Code snippets found (from Wave 2) - 2025 implementations only
- Recommended approach per skin
- Any useful libraries discovered

DO NOT implement anything. Research only. Next chat will plan, chat after that will build.
```

---

## Build Order (Future Phases)

1. **Cyberpunk first** (most extreme, proof of concept)
2. **Library second** (warm contrast to cyberpunk)
3. **Brutalist third** (simplest textures)
4. **Glass fourth** (builds on blur techniques from others)
