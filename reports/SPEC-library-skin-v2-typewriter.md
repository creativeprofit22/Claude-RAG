# Library Skin V2: Typewriter Edition

**Design Specification Document**
Version: 1.0
Date: 2025-12-29
Status: Ready for Implementation

---

## Executive Summary

Complete redesign of the Library skin from "classical card" aesthetic to fully skeuomorphic "boutique luxury library" with interactive mechanical elements. Core metaphors: **Typewriter + Card Catalog + Inkwell**.

### Key Differentiators
- Full animated typewriter for chat input (not just styling)
- Physical drawer mechanics for card catalog
- Ink as primary visual language (loading, errors, transitions)
- Sound design integrated throughout
- 3D/2.5D hybrid depth system

---

## 1. Core Identity

### Design Philosophy
**"Weavy, not old-school"** - Modern skeuomorphism that feels tactile and premium, not kitsch. Every element has weight, friction, and material properties.

### Three Pillars

| Pillar | Role | Primary Interactions |
|--------|------|---------------------|
| **Typewriter** | Chat input, text entry | Key depression, typebar swing, carriage movement, correction tape |
| **Card Catalog** | Data display, navigation | Drawer pull, card flip/thumb, card selection |
| **Inkwell** | Visual feedback language | Loading states, success/error, transitions, text rendering |

---

## 2. Material Palette

### 2.1 Paper
- **Style**: Aged parchment
- **Texture**: Visible grain, yellowed, deckle edges implied
- **Usage**: Input fields, content backgrounds, index cards

### 2.2 Brass
- **Style**: Antique patina with hints of verdigris
- **Texture**: Brushed metal with warm reflections
- **Usage**: Drawer pulls, typewriter keys, decorative accents, plaques

### 2.3 Wood
- **Style**: Dark walnut
- **Texture**: Visible grain, rich depth
- **Usage**: Card catalog body, typewriter frame, structural elements

### 2.4 Ink
- **Style**: Rich black-brown, bleeds into paper, wet sheen on fresh
- **Usage**: Text rendering, loading states, all visual feedback

---

## 3. Color System

### 3.1 Lighting
```css
/* Unified warm amber lighting, top-left source (~30deg) */
--light-source-angle: 135deg;
--ambient-light: rgba(255, 248, 230, 0.6);
--shadow-color: rgba(62, 39, 12, 0.4);
```

### 3.2 Ink Palette
```css
--ink-primary: #1a1208;           /* Rich black-brown, main text */
--ink-secondary: #3d2914;         /* Warm sepia, secondary text */
--ink-faded: #8b7355;             /* Aged ink, disabled states */
--ink-blot: #0d0906;              /* Deep black, error blots */
--ink-fresh: #2c1810;             /* Just-written, wet sheen */
--ink-highlight: rgba(184, 142, 58, 0.3);  /* Amber wash, selections */
```

### 3.3 Material Colors
```css
/* Paper */
--paper-aged: #f4e6c8;
--paper-shadow: #d4c6a8;
--paper-grain: rgba(139, 112, 40, 0.05);

/* Brass (antique) */
--brass-base: #8B7028;
--brass-highlight: #B8A050;
--brass-shadow: #4A3A10;
--brass-verdigris: rgba(82, 140, 120, 0.15);

/* Wood (dark walnut) */
--walnut-base: #3D2B1F;
--walnut-light: #5C4332;
--walnut-dark: #241810;
--walnut-grain: rgba(40, 25, 20, 0.15);
```

---

## 4. Depth System

### 4.1 Layer Hierarchy

| Layer | Treatment | Examples |
|-------|-----------|----------|
| **Hero (interactive)** | Full 3D | Card catalog drawer, typewriter keys/mechanism |
| **Content** | 2.5D (layered + shadow) | Index cards, paper panels, text areas |
| **UI Chrome** | 2.5D / flat + depth cues | Buttons, inputs, labels |
| **Ambient** | 3D static | Inkwell, banker's lamp (if used), decorative |

### 4.2 Consistency Rules
- All elements share same light source (top-left, ~30deg)
- Shadow color always warm brown (#3e270c), never gray
- Highlight color always warm white (#fff8e6)
- 3D elements use perspective, 2.5D uses layered shadows only

---

## 5. Typewriter Chat Input Component

### 5.1 Layout Structure

```
+------------------------------------------------------------+
|                     [Paper platen/roller]                   |
|  +------------------------------------------------------+   |
|  |                                                      |   |
|  |  Your message appears here with ink bleed           |   |  <- Paper (actual input)
|  |  + paper grain texture                              |   |
|  |                                              [|]    |   |  <- Cursor (carriage position)
|  +------------------------------------------------------+   |
|            ^^^ [Typebar striking zone] ^^^                  |
| ============================================================|
|     (_) (_) (_) (_) (_) (_) (_) (_) (_) (_)                 |  <- Cropped keyboard
|       Q   W   E   R   T   Y   U   I   O   P                 |     (visible on desktop)
+------------------------------------------------------------+
```

### 5.2 Component Parts

| Part | Visual | Animation |
|------|--------|-----------|
| **Frame** | Dark walnut body, brass accents | Static |
| **Paper roller/platen** | Cylindrical, rubber grip texture | Rotates on line advance |
| **Paper sheet** | Aged parchment, visible in roller | Scrolls up as user types |
| **Typebar basket** | 3-5 visible arms | Active arm swings up on keystroke |
| **Ribbon mechanism** | Ink ribbon spool | Subtle advance on type |
| **Correction tape arm** | White tape on swing arm | Deploys on backspace |
| **Carriage assembly** | Holds paper position indicator | Shifts left/right |
| **Key caps** | Round brass tops | Depress on keystroke |

### 5.3 Typing Animation Sequence (~80-100ms total)

```
1. Key cap depresses ------------------- 15ms
   - Spring compression feel
   - Slight shadow change
                ↓
2. Typebar swings up ------------------- 25ms
   - Rotates from basket toward paper
   - Letter-specific or morphing arm
                ↓
3. Character imprints ------------------ instant
   - Ink bleed effect
   - Slight "stamp" micro-animation
                ↓
4. Carriage shifts left ---------------- 20ms
   - One character width
   - Paper appears to move right
                ↓
5. Typebar returns to rest ------------- 20ms
   - Spring-back motion
                ↓
6. Key cap springs up ------------------ 15ms
   - Overshoot bounce (custom bezier)
```

### 5.4 Deletion Animation Sequence (Correction Tape)

```
1. Carriage shifts RIGHT --------------- 20ms
   - Back up one character
                ↓
2. Correction tape arm deploys --------- 25ms
   - Swings over paper surface
                ↓
3. White tape "rolls" over character --- 30ms
   - Character fades under white
   - Organic tape texture
                ↓
4. Tape arm retracts ------------------- 20ms
   - Returns to rest position
                ↓
5. Character is gone, cursor ready
```

**Rapid deletion (holding backspace):**
- Skip tape animation after first character
- Tape arm stays deployed
- Rapid carriage movement + characters fade in sequence

### 5.5 Special Actions

| Action | Animation |
|--------|-----------|
| **Enter/Send** | Carriage return lever pulls, carriage SLAMS right with momentum, bell dings, paper feeds, message "sends" |
| **New line (shift+enter)** | Paper advances one line, carriage returns (no bell) |
| **Tab** | Carriage jumps 4 spaces with mechanical ratchet feel |
| **Caps Lock** | Shift lock lever visually clicks down, stays locked |
| **Paste** | Rapid-fire typebar animation (sped up 3x), like frantic typing |

### 5.6 Mobile Adaptation
- Hide decorative keyboard (user has real virtual keyboard)
- Show only: paper + platen + typebar striking zone
- Mechanism animations still play
- Sounds still trigger (if enabled)

---

## 6. Card Catalog Component

### 6.1 Drawer Interaction

**Pull Open (~300-400ms):**
```
1. Initial friction (ease-in) --------- 100ms
   - Resistance feeling
                ↓
2. Smooth glide -----------------------  200ms
   - Wood-on-wood slide
                ↓
3. Soft stop --------------------------- 50ms
   - Catches at full extension
```

**Push Closed (~300ms):**
```
1. Initial push ------------------------ 50ms
   - Overcomes inertia
                ↓
2. Momentum slide --------------------- 200ms
   - Accelerating
                ↓
3. Impact + bounce --------------------- 50ms
   - Satisfying "thunk"
   - Subtle bounce-back
```

### 6.2 Card Interactions

| Action | Animation |
|--------|-----------|
| **Cards fan** | 3D perspective flip-through, like thumbing physical cards |
| **Card hover** | Slight lift, shadow depth increases |
| **Card select** | Lifts forward out of stack, shadow intensifies |
| **Card return** | Settles back into position |

### 6.3 Visual Elements

- **Drawer face**: Dark walnut with brass label holder
- **Label**: Hand-written style text (or typewriter font)
- **Brass pull**: Antique patina, reflects light on interaction
- **Index cards inside**: Aged paper, ruled lines, typewriter text

---

## 7. Ink Visual Language

### 7.1 State Mapping

| Application State | Ink Behavior |
|-------------------|--------------|
| **Text rendering** | Slight bleed into paper grain, not sharp pixel edges |
| **Loading** | Ink drop falls from pen nib, spreads organically |
| **Processing** | Ink swirls in inkwell (contained, cyclical) |
| **Success** | Clean stamp impression, wax seal drips then sets |
| **Error** | Ink blot spreads -> blotting paper absorbs (recoverable feel) |
| **Hover** | Ink pools slightly under cursor |
| **Selection** | Ink highlight bleeds through paper (see-through effect) |
| **Transitions** | Ink wash wipe - floods then recedes to reveal |
| **Empty states** | Dried ink stain, "nothing written here yet" |
| **Disabled** | Faded ink, like old document |

### 7.2 Technical Implementation

**Organic ink spread (GSAP + SVG):**
```javascript
gsap.timeline()
  .to(inkBlob, {
    scale: 1.8,
    duration: 0.6,
    ease: "power2.out",
  })
  .to(inkBlob, {
    morphSVG: organicBlobShape, // Irregular edges
    duration: 0.3,
  }, "<");
```

**Paper bleed effect (CSS filter):**
```css
.ink-text {
  filter: url(#paper-bleed-filter);
  /* SVG filter that feathers edges into paper grain */
}
```

**Wet ink sheen (CSS):**
```css
.fresh-ink {
  background: linear-gradient(
    135deg,
    var(--ink-fresh) 0%,
    rgba(255, 255, 255, 0.08) 50%,
    var(--ink-fresh) 100%
  );
  animation: wet-sheen 2s ease-out forwards;
}
```

---

## 8. Sound Design

### 8.1 Typewriter Sounds

| Action | Sound | Variations |
|--------|-------|------------|
| **Keystroke** | Mechanical click | 4-6 variations, +-5% pitch randomization |
| **Space bar** | Deeper thunk | Distinct from letter keys |
| **Backspace** | Reverse mechanism, softer | Key releasing without striking |
| **Enter/Send** | Carriage return swoosh + bell | The payoff moment |
| **Rapid typing** | Intelligent debounce | Don't stack 10 sounds |

### 8.2 UI Sounds

| Action | Sound |
|--------|-------|
| **Drawer open** | Wood sliding, brass handle clink |
| **Drawer close** | Slide + satisfying thunk |
| **Card flip** | Paper flutter |
| **Card select** | Soft paper lift |
| **Ink loading** | Subtle wet spread (ASMR-adjacent) |
| **Stamp/seal** | Impact + wax settling |
| **Error** | Ink bottle clink |

### 8.3 Audio UX Rules

```javascript
const audioConfig = {
  defaultVolume: 0.3,
  muteToggle: 'localStorage', // Persistent preference
  focusMode: true,            // Auto-mute when tab not visible
  reducedMotion: true,        // Respect prefers-reduced-motion
  firstInteraction: true,     // Sounds only after first user click
};
```

---

## 9. Pre-loader Sequence

### "The Library Opens" (~2-3 seconds)

```
Frame 1 (0-500ms):    Black screen
                      Banker's lamp chain pulls (if using lamp)
                      Warm amber glow spreads from center

Frame 2 (500-1000ms): Desk surface fades in
                      Typewriter silhouette visible
                      Inkwell, pen rest materialize

Frame 3 (1000-1500ms): Paper rolls into typewriter
                       Satisfying feed mechanism sound
                       Paper settles in platen

Frame 4 (1500-2500ms): Keys type: "Welcome to the Library..."
                       Full typewriter animation
                       Each character with sound

Frame 5 (2500-3000ms): Carriage return (bell ding)
                       UI elements fade in as "typed content"
                       Transition complete
```

### Skip Behavior
- Skip button appears after 1000ms
- `localStorage` flag: auto-skip after first view
- `prefers-reduced-motion`: instant fade-in, no sequence

---

## 10. Animation Technical Stack

### 10.1 Tool Assignment

| Animation Type | Tool | Why |
|----------------|------|-----|
| Complex timelines (typewriter sequence) | **GSAP** | Precise timing, bezier control |
| Component state, gestures | **Framer Motion** | React integration, gestures |
| Layout animations | **Framer Motion** | layoutId, AnimatePresence |
| Micro-interactions, hovers | **CSS** | Performance, simplicity |
| SVG morphing (ink blobs) | **GSAP + morphSVG** | Complex shape interpolation |
| Physics (bounce, spring) | **GSAP** | Custom easing, physics plugins |

### 10.2 Performance Budget

```
SVG assets total: < 100KB
Simultaneous animations: Max 3 complex, unlimited CSS
Target FPS: 60fps minimum
Memory: No retained SVG paths after animation
```

### 10.3 UX Timing Guardrails

| Interaction Type | Max Duration |
|------------------|--------------|
| Primary action (search, nav, submit) | 200ms |
| State change (drawer, modal) | 400ms |
| Loading feedback | 600ms before ink animation starts |
| Celebratory (success, complete) | 800ms |
| Pre-loader (first view) | 3000ms (skippable) |

### 10.4 Reduced Motion Fallback

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

All animations gracefully degrade to instant state changes.

---

## 11. File Structure (Proposed)

```
src/react/
├── skins/
│   ├── library-base.css         # Existing tokens (update)
│   └── library-typewriter.css   # New typewriter-specific styles
├── components/
│   └── library/
│       ├── TypewriterInput/
│       │   ├── TypewriterInput.tsx
│       │   ├── TypewriterInput.css
│       │   ├── Keyboard.tsx
│       │   ├── Paper.tsx
│       │   ├── TypebarMechanism.tsx
│       │   ├── CorrectionTape.tsx
│       │   └── sounds/
│       │       ├── keystroke-1.mp3
│       │       ├── keystroke-2.mp3
│       │       ├── keystroke-3.mp3
│       │       ├── keystroke-4.mp3
│       │       ├── space.mp3
│       │       ├── backspace.mp3
│       │       ├── carriage-return.mp3
│       │       └── bell.mp3
│       ├── CardCatalog/
│       │   ├── CardCatalog.tsx
│       │   ├── Drawer.tsx
│       │   ├── IndexCard.tsx
│       │   └── CardCatalog.css
│       ├── InkEffects/
│       │   ├── InkDrop.tsx
│       │   ├── InkBlot.tsx
│       │   ├── InkWash.tsx
│       │   └── filters.svg
│       └── Preloader/
│           ├── LibraryPreloader.tsx
│           └── LibraryPreloader.css
```

---

## 12. Implementation Phases

### Phase 1: Foundation
- [ ] Update library-base.css with new color tokens
- [ ] Create SVG assets (typewriter, card catalog, ink blobs)
- [ ] Set up sound file infrastructure
- [ ] Create base TypewriterInput component (static)

### Phase 2: Typewriter Core
- [ ] Implement key press detection + visual feedback
- [ ] Build typebar swing animation (GSAP timeline)
- [ ] Add carriage movement
- [ ] Integrate paper scroll
- [ ] Add sound triggers

### Phase 3: Correction Tape
- [ ] Build correction tape arm component
- [ ] Implement backspace animation sequence
- [ ] Handle rapid deletion (held backspace)
- [ ] Test edge cases (select-all delete, etc.)

### Phase 4: Card Catalog
- [ ] Build drawer component with open/close animation
- [ ] Create index card component
- [ ] Implement card fan/thumb gesture
- [ ] Add card selection animation

### Phase 5: Ink System
- [ ] Create SVG filters for paper bleed
- [ ] Build InkDrop loading component
- [ ] Implement ink blot error state
- [ ] Add ink wash page transitions

### Phase 6: Pre-loader
- [ ] Build full pre-loader sequence
- [ ] Implement skip logic
- [ ] Add localStorage first-view tracking
- [ ] Test reduced-motion fallback

### Phase 7: Polish & Integration
- [ ] Sound mixing and volume balancing
- [ ] Performance optimization
- [ ] Mobile adaptation
- [ ] Accessibility audit
- [ ] Cross-browser testing

---

## 13. Open Questions (For Implementation)

1. **Sound sourcing**: Record custom, license existing, or AI-generate?
2. **SVG complexity**: Hand-draw or use illustration tool?
3. **Typewriter model reference**: Specific vintage model to base design on?
4. **Card catalog capacity**: Max cards per drawer before virtualization?
5. **Ink filter browser support**: Fallback for Safari SVG filter bugs?

---

## 14. Reference Materials

### Visual Inspiration
- Vintage Remington/Underwood typewriters
- Library of Congress card catalog photography
- Antique brass scientific instruments
- Victorian writing desk accessories

### Technical Reference
- GSAP ScrollTrigger for parallax depth
- Framer Motion gesture recognition
- Web Audio API for sound management
- CSS Houdini for custom paint worklets (paper grain)

---

## Approval

- [ ] Design direction approved
- [ ] Technical approach approved
- [ ] Phase 1 scope confirmed
- [ ] Ready for implementation

---

*Document generated: 2025-12-29*
*For implementation by: Next Claude Code session*
