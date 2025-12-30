# Claude-RAG UI Freeze Debugging - Continuation Prompt V2

**Project Path:** `/home/reaver47/Documents/Claude-RAG`
**Date:** 2025-12-30
**Bug Severity:** CRITICAL - ALL SKINS NOW BROKEN
**Status:** UNRESOLVED - Previous fixes did NOT work

---

## CRITICAL UPDATE

**Original problem:** Library skin only - black screen freeze during API call
**Current problem:** ALL SKINS freeze and don't show response

This is either:
1. A regression from our fixes
2. The original diagnosis was wrong
3. A different/deeper root cause

---

## What Was Changed (REVERT CANDIDATES)

### 1. RAGChat.tsx (line 150-152)
**Change:** Commented out InkFilters rendering
```tsx
// BEFORE:
{skin === 'library' && <InkFilters />}

// AFTER:
{/* {skin === 'library' && <InkFilters />} */}
```
**File:** `/home/reaver47/Documents/Claude-RAG/src/react/RAGChat.tsx`

### 2. TypingIndicator.tsx (lines 29-48)
**Change:** Replaced InkDrop with LoadingDots for Library skin
```tsx
// Library skin now uses LoadingDots instead of InkDrop
if (skin === 'library') {
  return (
    <m.div className="rag-typing-indicator rag-typing-indicator--library" ...>
      <LoadingDots accentColor="var(--lib-accent, #8B4513)" ... />
    </m.div>
  );
}
```
**File:** `/home/reaver47/Documents/Claude-RAG/src/react/components/TypingIndicator.tsx`

### 3. LibraryPreloader.css (line 593-596)
**Change:** Added pointer-events: none to .completing
```css
.library-preloader.completing {
  animation: preloaderFadeOut 500ms ease-out forwards;
  pointer-events: none; /* Added this line */
}
```
**File:** `/home/reaver47/Documents/Claude-RAG/src/react/components/library/Preloader/LibraryPreloader.css`

### 4. demo/index.html
**Change:** Cache busting version updated to v=fix-1230-v4

---

## Server Status

Server is running and responding correctly:
- Port 3000 active (bun process)
- API returns 200 OK
- Logs show: "Query completed in 21590ms (Direct to claude: 1225 tokens)"
- State updates are logged correctly

**The problem is 100% frontend rendering, not API.**

---

## Previous Investigation Summary

### Round 1 (6 agents) - Identified:
- GSAP + Framer Motion conflict in InkDrop (infinite timeline)
- LibraryPreloader z-index 9999 overlay
- AnimatePresence opacity:0 overlap

### Round 2 (6 agents) - Identified:
- InkFilters SVG with expensive parameters (scale="20", numOctaves="6")
- TypewriterInput GSAP/Audio not stopped when disabled
- Missing pointer-events:none on .completing
- Component remounting risk from skin changes

### ALL FIXES APPLIED - PROBLEM PERSISTS AND WORSENED

---

## Key Files to Investigate

### State Management
1. `/home/reaver47/Documents/Claude-RAG/src/react/hooks/useRAGChat.ts` (148 lines)
   - The actual fetch and state update logic
   - isTyping, messages, error states

### Main Components
2. `/home/reaver47/Documents/Claude-RAG/src/react/RAGChat.tsx` (216 lines)
   - Main chat component
   - AnimatePresence wrapping TypingIndicator

3. `/home/reaver47/Documents/Claude-RAG/src/react/RAGInterface.tsx` (257 lines)
   - Wrapper that shows preloader for library skin
   - Controls conditional rendering

4. `/home/reaver47/Documents/Claude-RAG/src/react/components/MessageBubble.tsx` (133 lines)
   - Individual message rendering
   - Framer Motion animations

### Demo Infrastructure
5. `/home/reaver47/Documents/Claude-RAG/demo/demo.js` (12190 bytes)
   - React rendering logic
   - renderChat() function
   - Event listeners and skin switching

6. `/home/reaver47/Documents/Claude-RAG/demo/browser-entry.tsx`
   - Bundle entry point
   - Exports to RAGBundle global

7. `/home/reaver47/Documents/Claude-RAG/demo/index.html`
   - Script loading order
   - Skin switcher logic
   - React/ReactDOM CDN imports

### Build System
8. `/home/reaver47/Documents/Claude-RAG/package.json`
   - Build commands
   - Dependencies

---

## New Hypotheses to Test

### HIGH PRIORITY - Since ALL skins broken:

1. **React rendering pipeline broken**
   - Check if messages array updates but component doesn't re-render
   - Check React DevTools for state vs DOM mismatch
   - Check if React.StrictMode is causing double-rendering issues

2. **Fetch/Promise handling issue**
   - Check if response is being swallowed
   - Check for unhandled promise rejections
   - Check if setMessages is actually being called

3. **Bundle corruption**
   - Verify bundle entry point exports correctly
   - Check if RAGBundle.RAGInterface is the correct component
   - Check React/ReactDOM shim compatibility

4. **Event loop blocking**
   - Profile with Chrome DevTools during freeze
   - Check for synchronous operations blocking render
   - Check for infinite loops or recursive renders

5. **AnimatePresence exit animation blocking**
   - TypingIndicator exit animation might prevent new content render
   - Check if mode="wait" is needed vs mode="sync"
   - Check if key prop is causing remounts

6. **React 18 concurrent mode issue**
   - Using production UMD builds from CDN
   - Check for startTransition or Suspense boundaries
   - Check for hydration mismatches

7. **State update batching issue**
   - React 18 auto-batches state updates
   - Multiple setStates might not trigger render
   - Check if flushSync is needed

---

## Commands

### Start Server
```bash
cd /home/reaver47/Documents/Claude-RAG
bun run dist/server.js
```

### Rebuild Everything
```bash
cd /home/reaver47/Documents/Claude-RAG
npm run build && npm run build:demo
```

### Check Server
```bash
lsof -i :3000
curl http://localhost:3000/api/health
```

### Test API Directly
```bash
curl -X POST http://localhost:3000/api/rag/query \
  -H "Content-Type: application/json" \
  -d '{"query": "test"}'
```

---

## Bundle Verification

After rebuild, verify:
```bash
# Check createElement calls (should find rendering)
grep "createElement.*MessageBubble" demo/ragchat-bundle.js

# Check RAGBundle exports
grep "RAGBundle" demo/ragchat-bundle.js | head -5

# Check React shim
cat demo/react-shim.js
```

---

## Environment

- **Runtime:** Bun
- **Framework:** React 18 (UMD from unpkg CDN)
- **Animation:** Framer Motion 12.x + GSAP 3.x
- **Bundler:** esbuild
- **TypeScript:** 5.7.x

---

## Agent Deployment Instructions

Deploy 7 explore agents with VERY THOROUGH exploration:

1. **Agent 1: useRAGChat Hook Deep Dive**
   - Trace the entire fetch → setState → render flow
   - Add logging to verify each step
   - Check for race conditions

2. **Agent 2: React Rendering Pipeline**
   - Verify RAGChat component receives updated props
   - Check if messages.map is executing
   - Check if DOM elements are created but hidden

3. **Agent 3: demo.js and Initialization**
   - Check renderChat() for issues
   - Verify RAGBundle exports correctly
   - Check skin switcher side effects

4. **Agent 4: AnimatePresence Investigation**
   - Check exit animations blocking
   - Test removing AnimatePresence entirely
   - Check Framer Motion version compatibility

5. **Agent 5: Bundle and Shims**
   - Verify react-shim.js works correctly
   - Check if React.createElement is available
   - Verify lucide-shim.js exports

6. **Agent 6: CSS/Layout Investigation**
   - Check for display:none or visibility:hidden
   - Check z-index stacking issues
   - Check overflow:hidden clipping

7. **Agent 7: Network and Console Errors**
   - Check browser console for errors
   - Verify fetch completes and response parsed
   - Check for CORS or CSP issues

---

## Continuation Prompt

```
Debug critical UI freeze in Claude-RAG at /home/reaver47/Documents/Claude-RAG

Read the handoff document first:
/home/reaver47/Documents/Claude-RAG/HANDOFF-UI-FREEZE-V2.md

CRITICAL: The bug now affects ALL SKINS, not just Library.
- Submit query → UI freezes → No response displayed
- API returns 200 OK, server logs show success
- Problem is 100% frontend rendering

Previous fixes (InkFilters, InkDrop, pointer-events) did NOT work.

Deploy 7 explore agents for VERY THOROUGH exploration with ultrathink:
1. useRAGChat hook state flow
2. React rendering pipeline
3. demo.js initialization
4. AnimatePresence animations
5. Bundle and shims
6. CSS/Layout issues
7. Network/Console errors

Focus on WHY messages don't render after API success.
```
