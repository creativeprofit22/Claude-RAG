# Claude-RAG UI Freeze Debugging - Continuation Prompt

**Project Path:** `/home/reaver47/Documents/Claude-RAG`
**Date:** 2025-12-30
**Bug Severity:** Critical - Blocks all Library skin chat functionality
**Status:** ✅ FIXED (2025-12-30)

---

## FIX APPLIED

**Root Cause:** GSAP + Framer Motion animation conflict in InkDrop component.

InkDrop uses `gsap.timeline({ repeat: -1 })` (infinite animation) while being wrapped in Framer Motion's `AnimatePresence`. Both systems fight for control of `opacity` and `transform` properties, causing animation deadlock and black screen.

**Solution:** Disabled InkDrop for Library skin TypingIndicator, using LoadingDots instead.

**File Changed:** `/src/react/components/TypingIndicator.tsx`

```tsx
// Library skin: Use LoadingDots (InkDrop disabled due to GSAP + Framer Motion conflict)
if (skin === 'library') {
  return (
    <m.div className="rag-typing-indicator rag-typing-indicator--library" ...>
      <LoadingDots accentColor="var(--lib-accent, #8B4513)" ... />
    </m.div>
  );
}
```

**TODO for future:** Fix InkDrop by either:
1. Remove GSAP and use pure Framer Motion animations
2. Create a GSAP + Framer adapter to prevent conflicts
3. Move InkDrop outside of AnimatePresence wrapper

---

## Original Problem Statement

When using the **Library skin**, submitting a query causes the UI to:
1. Go **BLACK** (entire screen)
2. **FREEZE** for ~15 seconds (duration of API call)
3. **RESET** back to chat interface - response DOES NOT display
4. API returns **200 OK**, logs show state updates correctly

**This only affects the Library skin** - other skins (Cyberpunk, Brutalist, Glass) work correctly.

---

## Attempted Fixes (DID NOT WORK)

### 1. Debug Logging (No Effect)
Added console.log throughout the state flow:
- `/home/reaver47/Documents/Claude-RAG/src/react/hooks/useRAGChat.ts`
- `/home/reaver47/Documents/Claude-RAG/src/react/RAGChat.tsx`
- `/home/reaver47/Documents/Claude-RAG/src/react/components/library/TypewriterInput/TypewriterInput.tsx`
- `/home/reaver47/Documents/Claude-RAG/src/react/components/MessageBubble.tsx`

**Result:** Logs showed state updating correctly, but UI still freezes.

### 2. AnimatePresence Mode Change (No Effect)
Changed AnimatePresence mode from `"popLayout"` to `"sync"` in RAGChat.tsx.

**Result:** No change in behavior.

### 3. Removed AnimatePresence from Messages (No Effect)
Removed AnimatePresence wrapping messages entirely, only wrapped TypingIndicator:
```tsx
// In RAGChat.tsx around line 185
<AnimatePresence>
  {isTyping && <TypingIndicator key="typing" accentColor={accentColor} />}
</AnimatePresence>
```

**Result:** No change in behavior.

### 4. Added typingEnded Detection (No Effect)
Modified auto-scroll logic to detect when typing ends:
```tsx
const typingEnded = !isTyping && wasTypingRef.current;
const shouldScroll = messageCountIncreased || typingStarted || typingEnded;
```

**Result:** No change in behavior.

### 5. Added 100ms Delay to Auto-scroll (No Effect)
Added delay when typing ends to let animations settle:
```tsx
const delay = typingEnded ? 100 : 0;
setTimeout(() => {
  requestAnimationFrame(() => { /* scroll */ });
}, delay);
```

**Result:** No change in behavior.

### 6. Cache Busting (No Effect)
Updated all cache busting versions in `/home/reaver47/Documents/Claude-RAG/demo/index.html`:
```html
<link rel="stylesheet" href="/demo/skins.css?v=fix-1230">
<link rel="stylesheet" href="/dist/react/styles.css?v=fix-1230">
<link rel="stylesheet" href="/demo/ragchat-bundle.css?v=fix-1230">
<link rel="stylesheet" href="/demo/styles.css?v=fix-1230">
<script src="/demo/ragchat-bundle.js?v=fix-1230"></script>
```

**Result:** No change in behavior.

### 7. Server Restart (No Effect)
Killed and restarted the Bun dev server multiple times.

**Result:** No change in behavior.

---

## Agent Investigation Findings

### 1. AnimatePresence opacity:0 overlap
AnimatePresence animations could cause opacity:0 overlap between exiting and entering elements, potentially creating a "flash" of invisible content.

### 2. LibraryPreloader z-index:9999 with black background
File: `/home/reaver47/Documents/Claude-RAG/src/react/components/library/Preloader/LibraryPreloader.css`
```css
.library-preloader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #000000;
}
```
**Hypothesis:** Could the preloader be re-rendering or somehow becoming visible during the API call?

### 3. TypingIndicator wasn't wrapped in AnimatePresence
Initially TypingIndicator wasn't properly wrapped - this was fixed but didn't resolve the issue.

### 4. Auto-scroll timing during animations
Scroll timing issues during Framer Motion animations could cause layout thrashing.

### 5. InkDrop GSAP animations might block main thread
File: `/home/reaver47/Documents/Claude-RAG/src/react/components/library/InkEffects/InkDrop.tsx`

The InkDrop component uses GSAP timelines with `repeat: -1`:
```tsx
const tl = gsap.timeline({ repeat: -1 });
timelineRef.current = tl;
```

**Hypothesis:** GSAP animations running during the fetch could:
- Block the main thread
- Cause React reconciliation issues
- Conflict with Framer Motion's animation system

---

## Key Files to Investigate

### Core Chat Components
1. `/home/reaver47/Documents/Claude-RAG/src/react/RAGChat.tsx` (214 lines)
   - Main chat component, renders messages, handles Library skin detection

2. `/home/reaver47/Documents/Claude-RAG/src/react/hooks/useRAGChat.ts` (148 lines)
   - State management hook for messages, isTyping, error

3. `/home/reaver47/Documents/Claude-RAG/src/react/components/MessageBubble.tsx` (133 lines)
   - Individual message rendering with Framer Motion

4. `/home/reaver47/Documents/Claude-RAG/src/react/components/TypingIndicator.tsx` (65 lines)
   - Uses InkDrop for Library skin, LoadingDots for others

### Library-Specific Components
5. `/home/reaver47/Documents/Claude-RAG/src/react/components/library/TypewriterInput/TypewriterInput.tsx` (420 lines)
   - GSAP animations for typewriter effect
   - Extensive useCallback/useEffect usage

6. `/home/reaver47/Documents/Claude-RAG/src/react/components/library/InkEffects/InkDrop.tsx` (177 lines)
   - GSAP timeline with infinite repeat
   - Renders when TypingIndicator is shown

7. `/home/reaver47/Documents/Claude-RAG/src/react/components/library/Preloader/LibraryPreloader.tsx` (340 lines)
   - z-index: 9999 overlay
   - Uses GSAP + typewriter sound

8. `/home/reaver47/Documents/Claude-RAG/src/react/components/library/Preloader/LibraryPreloader.css` (704 lines)
   - Fixed positioning, black background

### Interface Wrapper
9. `/home/reaver47/Documents/Claude-RAG/src/react/RAGInterface.tsx` (257 lines)
   - Shows LibraryPreloader before main interface for library skin
   - Conditional rendering based on `preloaderComplete` state

---

## Remaining Hypotheses to Test

### HIGH Priority

1. **LibraryPreloader Re-rendering**
   - Check if `preloaderComplete` state is being reset during API call
   - Add console.log in RAGInterface to track `shouldShowPreloader` value
   - Possible: State reset from hot-reload or React key changes

2. **GSAP Animation Conflicts**
   - InkDrop creates infinite GSAP timeline during loading
   - TypewriterInput has multiple GSAP animations
   - Test: Disable InkDrop entirely, use LoadingDots for Library skin temporarily

3. **React Suspense/Boundary Issue**
   - Check if there's an error boundary catching and hiding errors
   - The "reset" behavior suggests unmount/remount cycle

### MEDIUM Priority

4. **CSS z-index Stacking**
   - LibraryPreloader has z-index: 9999
   - Check if any element is accidentally inheriting or triggering this

5. **Framer Motion + GSAP Conflict**
   - Both animation libraries manipulating the same elements
   - Test: Convert Library skin to use only Framer Motion

6. **Memory/Performance Issue**
   - Profile with Chrome DevTools during the freeze
   - Check for memory leaks in GSAP timelines
   - Verify all useEffect cleanups are running

### LOW Priority

7. **Server Response Timing**
   - Claude CLI takes ~15 seconds, matching freeze duration
   - May need to handle long-running requests differently

8. **Browser-Specific Issue**
   - Test in different browsers
   - Check for browser-specific CSS issues

---

## Commands to Run

### Start Development Server
```bash
cd /home/reaver47/Documents/Claude-RAG
bun run dev
# OR
npm run dev
```

### Rebuild Demo Bundle
```bash
cd /home/reaver47/Documents/Claude-RAG
npm run build:demo
```

### Full Rebuild
```bash
cd /home/reaver47/Documents/Claude-RAG
npm run build && npm run build:demo
```

### Access Demo
Open browser to: `http://localhost:3000/demo/`
(Default port is 3000, check server output)

### Run Tests
```bash
cd /home/reaver47/Documents/Claude-RAG
bun test
```

---

## Current State of Code

### RAGChat.tsx (lines 185-189)
```tsx
<AnimatePresence>
  {isTyping && <TypingIndicator key="typing" accentColor={accentColor} />}
</AnimatePresence>
```

### TypingIndicator.tsx - Library skin branch (lines 30-46)
```tsx
if (skin === 'library') {
  return (
    <m.div
      className="rag-typing-indicator rag-typing-indicator--library"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={motion.message}
    >
      <InkDrop
        active={true}
        size="md"
        ariaLabel={isProcessing ? 'Processing...' : 'Assistant is typing...'}
      />
    </m.div>
  );
}
```

### RAGInterface.tsx - Preloader conditional (lines 124-134)
```tsx
const shouldShowPreloader = showPreloader && skin === 'library' && !preloaderComplete;

if (shouldShowPreloader) {
  return (
    <LibraryPreloader
      onComplete={handlePreloaderComplete}
      welcomeText={preloaderWelcomeText}
      soundEnabled={preloaderSoundEnabled}
    />
  );
}
```

---

## Suggested Next Steps

1. **Add State Logging in RAGInterface**
   ```tsx
   console.log('[RAGInterface] shouldShowPreloader:', shouldShowPreloader, {
     showPreloader,
     skin,
     preloaderComplete
   });
   ```

2. **Temporarily Disable InkDrop**
   In TypingIndicator.tsx, force use of LoadingDots even for Library skin:
   ```tsx
   // if (skin === 'library') { ... }  // Comment out this block
   ```

3. **Profile with DevTools**
   - Open Chrome DevTools > Performance
   - Record during query submission
   - Look for long tasks, layout thrashing, or paint issues

4. **Check for Console Errors**
   - Open DevTools Console
   - Look for React errors, GSAP warnings, or uncaught exceptions

5. **Test Component Isolation**
   - Create a minimal test case with just RAGChat
   - Remove RAGInterface wrapper entirely
   - See if freeze still occurs

---

## Environment Info

- **Runtime:** Bun
- **Framework:** React 18
- **Animation:** Framer Motion 12.x + GSAP 3.x
- **Bundler:** esbuild (for demo bundle)
- **TypeScript:** 5.7.x
