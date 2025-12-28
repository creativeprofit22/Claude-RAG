# Component Integration Roadmap
## Claude-RAG - Phased Motion, Charts & Styling Rollout

**Created:** 2025-12-28
**Status:** Ready for implementation

---

## Component Inventory (25 Total)

### High Impact (8 components)
| Component | File | Priority |
|-----------|------|----------|
| RAGChat | `RAGChat.tsx` | P1 |
| MessageBubble | `components/MessageBubble.tsx` | P1 |
| ChatInput | `components/ChatInput.tsx` | P1 |
| ChatHeader | `components/ChatHeader.tsx` | P2 |
| DocumentCard | `components/documents/DocumentCard.tsx` | P1 |
| DocumentList | `components/documents/DocumentList.tsx` | P2 |
| RAGInterface | `RAGInterface.tsx` | P2 |
| TypingIndicator | `components/TypingIndicator.tsx` | P1 |

### Medium Impact (9 components)
| Component | File | Priority |
|-----------|------|----------|
| DocumentLibrary | `components/documents/DocumentLibrary.tsx` | P2 |
| DocumentPreview | `components/documents/DocumentPreview.tsx` | P3 |
| DocumentSearch | `components/documents/DocumentSearch.tsx` | P3 |
| UploadModal | `components/upload/UploadModal.tsx` | P3 |
| FileDropZone | `components/upload/FileDropZone.tsx` | P3 |
| FileQueue | `components/upload/FileQueue.tsx` | P3 |
| ConfirmDialog | `components/shared/ConfirmDialog.tsx` | P3 |
| EmptyState | `components/shared/EmptyState.tsx` | P4 |
| AdminDashboard | `components/admin/AdminDashboard.tsx` | P2 |

### Low Impact (8 components)
| Component | File | Priority |
|-----------|------|----------|
| SettingsModal | `components/settings/SettingsModal.tsx` | P4 |
| ApiKeyConfigBar | `components/settings/ApiKeyConfigBar.tsx` | P4 |
| CategoryFilter | `components/categories/CategoryFilter.tsx` | P4 |
| CategoryBadge | `components/categories/CategoryBadge.tsx` | P4 |
| Dropdown | `components/shared/Dropdown.tsx` | P4 |
| ProgressIndicator | `components/upload/ProgressIndicator.tsx` | P4 |
| FilePreview | `components/upload/FilePreview.tsx` | P4 |
| LoadingDots | `components/LoadingDots.tsx` | P4 |

---

## Phased Rollout

### Phase 1: Core Infrastructure + High-Impact (Week 1-2)

**Infrastructure:**
1. Install: `framer-motion`, `gsap`, `@gsap/react`
2. Create `src/react/motion/` directory structure
3. Build types, constants, gsap-init
4. Build all 4 skin variant files
5. Build core hooks (useSkinMotion, useSkinDetect, useReducedMotion)
6. Create MotionProvider

**Components:**
- [ ] MessageBubble - entrance, sources accordion
- [ ] ChatInput - button hover/tap, focus glow
- [ ] DocumentCard - hover lift, selection state
- [ ] TypingIndicator - entrance/exit

**Deliverable:** Chat feels alive, cards have hover feedback

---

### Phase 2: Charts + Admin (Week 3-4)

**Infrastructure:**
1. Install: `echarts`, `echarts-for-react`
2. Create `src/react/charts/` directory
3. Build 4 ECharts themes
4. Create SkinAwareChart wrapper
5. Add Tailwind (hybrid setup)

**Components:**
- [ ] AdminDashboard - ECharts bar chart, stat counters
- [ ] DocumentList - stagger entrance, filter animation
- [ ] RAGInterface - tab switch transitions
- [ ] RAGChat - empty state animation
- [ ] DocumentLibrary - container orchestration

**Deliverable:** Admin has real charts, lists animate smoothly

---

### Phase 3: Modals + Upload (Week 5)

**Components:**
- [ ] UploadModal - modal enter/exit, drop zone
- [ ] DocumentPreview - preview modal animation
- [ ] ConfirmDialog - alert animation
- [ ] FileDropZone - drag state animations
- [ ] FileQueue - list stagger, progress

**Deliverable:** Upload flow feels polished

---

### Phase 4: Polish + Remaining (Week 6)

**Components:**
- [ ] EmptyState - subtle entrance
- [ ] ChatHeader - status transitions
- [ ] DocumentSearch - interaction feedback
- [ ] SettingsModal - modal polish
- [ ] CategoryFilter - dropdown animation
- [ ] CategoryBadge - hover states
- [ ] Dropdown - open/close animation
- [ ] ProgressIndicator - stage transitions
- [ ] FilePreview - card entrance
- [ ] ApiKeyConfigBar - status badge animation

**Deliverable:** Complete motion system

---

### Phase 5: Advanced (Optional)

- Particle effects per skin
- Page transitions
- 3D effects (card flip, perspective)
- Sound design

---

## Shared Animation Patterns

```typescript
// src/react/motion/patterns.ts

// Card entrance (DocumentCard, StatCard, SourceItem)
export const cardEntrance = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 }
};

// List stagger (DocumentList, FileQueue, RecentUploads)
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

// Modal (all modals)
export const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

export const modalContent = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 16 }
};

// Button hover (all buttons)
export const buttonHover = {
  scale: 1.02,
  transition: { type: "spring", stiffness: 400 }
};

// Accordion (sources, dropdowns)
export const accordion = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1 }
};
```

---

## Per-Component Animation Specs (Top 5)

### 1. MessageBubble
- **Entrance:** Slide up + fade (skin-specific direction)
- **Sources:** Height animate open/close
- **Timestamp:** Fade in delayed

### 2. DocumentCard
- **Entrance:** Stagger from parent
- **Hover:** Lift (translateY -2px), shadow expand
- **Selection:** Border pulse
- **Delete hover:** Shake warning

### 3. AdminDashboard
- **Stats:** Number counter on load
- **Chart:** ECharts animated bars (replace CSS bars)
- **Services:** Stagger entrance
- **Refresh:** Spin icon

### 4. UploadModal
- **Modal:** Scale + fade from center
- **Drop zone:** Border dash animate, success pulse
- **Queue:** Stagger add, animate remove

### 5. DocumentList
- **Initial:** Stagger entrance (0.05s each)
- **Filter:** Cards animate in/out
- **Reorder:** Layout animation on sort

---

## Testing Strategy

### Per-Skin Verification
For each component:
- [ ] Library skin - scholarly, refined
- [ ] Cyberpunk skin - electric, bouncy
- [ ] Brutalist skin - instant, mechanical
- [ ] Glass skin - smooth, floating

### Reduced Motion
```typescript
const shouldReduceMotion = useReducedMotion();
// Skip animations if true
```

### Performance
- Target 60fps during animations
- Cleanup GSAP on unmount
- Monitor bundle size impact

---

## Key Files for Implementation

1. `src/react/components/MessageBubble.tsx` - Most visible
2. `src/react/components/documents/DocumentCard.tsx` - Card pattern template
3. `src/react/components/admin/AdminDashboard.tsx` - ECharts integration
4. `src/react/tokens/animation.css` - Existing timing tokens
5. `demo/skins.css` - Skin variables reference
