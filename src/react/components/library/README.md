# Library Skin V2: Typewriter Edition

Skeuomorphic UI components for the Claude-RAG Library skin.

## Status: Prototype

This is a proof-of-concept implementation. See full design specification:
`/reports/SPEC-library-skin-v2-typewriter.md`

## Components

### TypewriterInput (Implemented - Prototype)

Fully animated typewriter chat input with:
- Key depression animation
- Typebar swing mechanism
- Carriage movement tracking
- Correction tape for backspace
- Synthetic sound effects (placeholder)

**Usage:**
```tsx
import { TypewriterInput } from './components/library';

function ChatInput() {
  const [message, setMessage] = useState('');

  return (
    <TypewriterInput
      value={message}
      onChange={setMessage}
      onSubmit={(text) => console.log('Send:', text)}
      placeholder="Type your message..."
      soundEnabled={true}
      showKeyboard={true} // Desktop only
    />
  );
}
```

**Dependencies:**
- GSAP (for timeline animations)
- React 18+

### CardCatalog (Not Implemented)

Planned: Drawer interaction, card flip/fan gestures.

### InkEffects (Not Implemented)

Planned: SVG filters for ink bleed, loading states, transitions.

### Preloader (Not Implemented)

Planned: "The Library Opens" sequence.

## File Structure

```
library/
├── TypewriterInput/
│   ├── TypewriterInput.tsx     # Main component
│   ├── TypewriterInput.css     # Styles
│   ├── typewriter.types.ts     # TypeScript types
│   ├── useTypewriterSound.ts   # Sound hook
│   ├── index.ts                # Exports
│   └── sounds/                 # Audio files (empty)
├── index.ts                    # Module exports
└── README.md                   # This file
```

## TODOs for Production

1. **Sound Files**: Replace Web Audio API synth with actual .mp3 files
2. **SVG Typewriter**: Replace CSS-only visual with detailed SVG
3. **GSAP morphSVG**: Add for typebar letter morphing
4. **Mobile Testing**: Verify keyboard hide behavior
5. **Performance**: Profile animation frame rate
6. **Accessibility**: Screen reader announcements, reduced motion

## Design Tokens

The prototype uses inline CSS variables. Production should use:
- `/skins/library-base.css` (existing tokens)
- New `/skins/library-typewriter.css` (typewriter-specific)

## Animation Timing Reference

| Phase | Duration |
|-------|----------|
| Key down | 15ms |
| Typebar swing | 25ms |
| Strike | 5ms |
| Carriage shift | 20ms |
| Typebar return | 20ms |
| Key up | 15ms |
| **Total type cycle** | **~100ms** |
| Correction deploy | 25ms |
| Correction cover | 30ms |
| Correction retract | 20ms |
| **Total backspace** | **~75ms** |
| Carriage return | 300ms |
| Bell ring | 150ms |
