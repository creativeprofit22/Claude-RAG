# Motion System Architecture Plan
## Claude-RAG - 4 Distinct Motion Personalities

**Created:** 2025-12-28
**Status:** Ready for implementation

---

## 1. Package Setup

### Dependencies to Install

```bash
npm install framer-motion gsap @gsap/react
```

### GSAP Plugin Registration

```typescript
// src/react/motion/gsap-init.ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

export function initGSAP() {
  if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, TextPlugin);
  }
}

export { gsap, ScrollTrigger };
```

---

## 2. File Structure

```
src/react/motion/
├── index.ts                    # Public exports
├── gsap-init.ts               # GSAP plugin registration
├── types.ts                   # Motion type definitions
├── constants.ts               # Timing constants, spring configs
│
├── variants/
│   ├── index.ts               # Variant exports
│   ├── library.ts             # Victorian motion personality
│   ├── cyberpunk.ts           # Neon/glitch motion personality
│   ├── brutalist.ts           # Industrial motion personality
│   └── glass.ts               # Morphism motion personality
│
├── hooks/
│   ├── index.ts               # Hook exports
│   ├── useSkinMotion.ts       # Primary hook - returns current skin's motion config
│   ├── useSkinDetect.ts       # Detects current data-skin attribute
│   ├── useReducedMotion.ts    # Respects prefers-reduced-motion
│   └── useScrollReveal.ts     # GSAP ScrollTrigger hook
│
├── components/
│   ├── index.ts               # Component exports
│   ├── MotionProvider.tsx     # Context provider for motion config
│   ├── SkinTransition.tsx     # AnimatePresence wrapper with skin awareness
│   ├── PageTransition.tsx     # Route/view transition wrapper
│   └── effects/
│       ├── GlitchText.tsx     # Cyberpunk text effect
│       ├── InkBleed.tsx       # Library text reveal
│       ├── TypewriterText.tsx # Brutalist text effect
│       └── GlowPulse.tsx      # Glass focus effect
│
└── primitives/
    ├── index.ts               # Primitive exports
    ├── MotionCard.tsx         # Animated card wrapper
    ├── MotionModal.tsx        # Animated modal wrapper
    ├── MotionList.tsx         # Staggered list animations
    └── MotionButton.tsx       # Button hover/tap states
```

---

## 3. Type Definitions

```typescript
// src/react/motion/types.ts
import type { Variants, Transition, TargetAndTransition } from 'framer-motion';

export type SkinType = 'library' | 'cyberpunk' | 'brutalist' | 'glass';

export interface SkinMotionConfig {
  enter: TargetAndTransition;
  exit: TargetAndTransition;
  hover: TargetAndTransition;
  tap: TargetAndTransition;
  focus: TargetAndTransition;

  card: Variants;
  modal: Variants;
  message: Variants;
  list: Variants;
  button: Variants;

  transition: {
    default: Transition;
    fast: Transition;
    slow: Transition;
    spring: Transition;
  };

  stagger: {
    children: number;
    delayChildren: number;
  };

  effects?: {
    glitch?: boolean;
    inkBleed?: boolean;
    typewriter?: boolean;
    glowPulse?: boolean;
    particles?: 'dust' | 'data' | 'none';
  };
}
```

---

## 4. Skin Motion Personalities

### Library (Victorian)
- **Character:** Dignified, scholarly, weighted
- **Timing:** 500ms, ease-out [0.16, 1, 0.3, 1]
- **Effects:** Page-turn, ink-bleed text, subtle dust particles
- **Stagger:** 0.08s children, 0.1s delay

```typescript
enter: {
  opacity: 1,
  y: 0,
  rotateX: 0,
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
},
hover: {
  y: -4,
  boxShadow: '0 8px 24px rgba(139, 69, 19, 0.2)',
},
```

### Cyberpunk (Neon)
- **Character:** Aggressive, digital, glitchy
- **Timing:** 300ms, sharp ease [0.23, 1, 0.32, 1]
- **Effects:** Glitch, flicker, clip-path reveals, data particles
- **Stagger:** 0.04s children, 0.05s delay

```typescript
enter: {
  opacity: 1,
  x: 0,
  clipPath: 'inset(0% 0% 0% 0%)',
  filter: 'brightness(1) hue-rotate(0deg)',
  transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
},
hover: {
  boxShadow: '0 0 20px rgba(0, 255, 255, 0.4), 0 0 40px rgba(255, 0, 128, 0.2)',
},
```

### Brutalist (Bauhaus)
- **Character:** Mechanical, hard stops, functional
- **Timing:** 200ms, LINEAR (no easing)
- **Effects:** Typewriter text, stamp-down, zero decorative motion
- **Stagger:** 0.05s children, 0s delay

```typescript
enter: {
  opacity: 1,
  y: 0,
  transition: { duration: 0.2, ease: 'linear' },
},
hover: {
  x: 4,
  y: 4,
  boxShadow: '4px 4px 0 #000000',
},
```

### Glass (Morphism)
- **Character:** Soft, floating, liquid
- **Timing:** 400ms, spring with overshoot
- **Effects:** Blur fade, glow pulse, float up
- **Stagger:** 0.07s children, 0.15s delay

```typescript
enter: {
  opacity: 1,
  y: 0,
  filter: 'blur(0px)',
  transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
},
hover: {
  y: -2,
  scale: 1.01,
  boxShadow: '0 12px 40px rgba(138, 43, 226, 0.15)',
},
```

---

## 5. Core Hooks

### useSkinDetect
```typescript
export function useSkinDetect(): SkinType {
  const [skin, setSkin] = useState<SkinType>('library');

  useEffect(() => {
    const detectSkin = () => {
      const attr = document.body.getAttribute('data-skin');
      if (attr && ['library', 'cyberpunk', 'brutalist', 'glass'].includes(attr)) {
        setSkin(attr as SkinType);
      }
    };

    detectSkin();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-skin') {
          detectSkin();
        }
      }
    });

    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return skin;
}
```

### useSkinMotion
```typescript
export function useSkinMotion(): { skin: SkinType; motion: SkinMotionConfig; reducedMotion: boolean } {
  const skin = useSkinDetect();
  const reducedMotion = useReducedMotion();

  const motion = useMemo(() => {
    if (reducedMotion) return reducedMotionConfig;
    return skinMotionMap[skin];
  }, [skin, reducedMotion]);

  return { skin, motion, reducedMotion };
}
```

---

## 6. GSAP Usage

### Where to Use GSAP vs Framer Motion

| Use Case | Library |
|----------|---------|
| Mount/unmount animations | Framer Motion |
| Hover/tap states | Framer Motion |
| Layout animations | Framer Motion |
| Scroll-triggered reveals | GSAP ScrollTrigger |
| Complex timelines | GSAP |
| Text character animations | GSAP TextPlugin |
| Scrub/parallax | GSAP ScrollTrigger |

### useScrollReveal Hook
```typescript
export function useScrollReveal(options = {}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const skin = useSkinDetect();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const animations = {
      library: { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' },
      cyberpunk: { clipPath: 'inset(0% 100% 0% 0%)', opacity: 0, duration: 0.4 },
      brutalist: { y: -20, opacity: 0, duration: 0.25, ease: 'none' },
      glass: { y: 30, opacity: 0, filter: 'blur(10px)', duration: 0.5 },
    };

    gsap.from(element, {
      ...animations[skin],
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, [skin]);

  return elementRef;
}
```

---

## 7. Special Effects Components

### GlitchText (Cyberpunk only)
- GSAP timeline with skewX, hue-rotate, text-shadow
- Triggers on hover or continuously
- Only renders effect for cyberpunk skin

### InkBleed (Library only)
- Framer Motion blur-to-sharp with color reveal
- Text shadow fades as text becomes visible
- 800ms duration, delayed per character

### TypewriterText (Brutalist only)
- Character-by-character reveal
- Blinking cursor at end
- Monospace font enforced

### GlowPulse (Glass only)
- Subtle box-shadow animation on focus
- Spring-based, continuous while focused

---

## 8. Implementation Order

### Phase 1: Foundation
1. Install packages
2. Create directory structure
3. Build types.ts, constants.ts, gsap-init.ts
4. Build all 4 variant files
5. Build core hooks

### Phase 2: Provider & Primitives
1. MotionProvider with context
2. SkinTransition wrapper
3. MotionCard, MotionModal, MotionList primitives
4. useScrollReveal hook

### Phase 3: Component Integration
1. MessageBubble
2. DocumentCard
3. UploadModal, ConfirmDialog
4. AdminDashboard

### Phase 4: Special Effects
1. GlitchText
2. InkBleed
3. TypewriterText
4. GlowPulse

---

## 9. Performance Considerations

1. Use `LazyMotion` with `domAnimation` (smaller bundle)
2. Prefer `transform` and `opacity` for GPU acceleration
3. Always cleanup GSAP with `ctx.revert()` or `ScrollTrigger.kill()`
4. Respect `prefers-reduced-motion`
5. Use `will-change` sparingly

---

## Key Files

- `/home/reaver47/Documents/Claude-RAG/src/react/tokens/animation.css` - Existing CSS tokens
- `/home/reaver47/Documents/Claude-RAG/demo/skins.css` - Skin variables
- `/home/reaver47/Documents/Claude-RAG/src/react/components/MessageBubble.tsx` - First integration target
