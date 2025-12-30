/**
 * InkEffects Module
 * Library Skin V2: Typewriter Edition
 *
 * Ink visual language components for:
 * - Loading states (InkDrop)
 * - Processing states (InkSwirl)
 * - Error states (InkBlot)
 * - Page transitions (InkWash)
 *
 * Usage:
 * ```tsx
 * import {
 *   InkDrop,
 *   InkSwirl,
 *   InkBlot,
 *   InkWash,
 *   useInkWash,
 * } from '@/components/library/InkEffects';
 * ```
 */

// Components
export { InkDrop } from './InkDrop.js';
export { InkBlot } from './InkBlot.js';
export { InkSwirl } from './InkSwirl.js';
export { InkWash, useInkWash } from './InkWash.js';
export { InkFilters } from './InkFilters.js';

// Types
export type {
  InkState,
  InkPalette,
  InkTiming,
  InkSize,
  InkFilter,
  InkBaseProps,
  InkDropProps,
  InkBlotProps,
  InkSwirlProps,
  InkWashProps,
  UseInkWashReturn,
  InkAnimationConfig,
} from './ink.types.js';

// Constants
export {
  INK_PALETTE,
  INK_TIMING,
  INK_SIZES,
  INK_ANIMATION_CONFIGS,
  getInkFilter,
} from './ink.types.js';

// Re-export default components for convenience
export { default as InkDropDefault } from './InkDrop.js';
export { default as InkBlotDefault } from './InkBlot.js';
export { default as InkSwirlDefault } from './InkSwirl.js';
export { default as InkWashDefault } from './InkWash.js';
export { default as InkFiltersDefault } from './InkFilters.js';
