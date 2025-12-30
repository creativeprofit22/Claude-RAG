/**
 * InkEffects - Type Definitions
 * Library Skin V2: Typewriter Edition
 *
 * Shared types for ink visual language components.
 */

import type { ReactNode } from 'react';

/**
 * Application states mapped to ink behaviors
 */
export type InkState =
  | 'idle'           // No activity
  | 'loading'        // Ink drop from nib
  | 'processing'     // Ink swirl in inkwell
  | 'success'        // Stamp impression (future)
  | 'error'          // Ink blot spreads
  | 'hover'          // Ink pools under cursor
  | 'selection'      // Ink highlight bleed
  | 'transition'     // Ink wash wipe
  | 'empty'          // Dried ink stain
  | 'disabled';      // Faded ink

/**
 * Ink color palette
 */
export interface InkPalette {
  primary: string;      // Rich black-brown, main text
  secondary: string;    // Warm sepia, secondary text
  faded: string;        // Aged ink, disabled states
  blot: string;         // Deep black, error blots
  fresh: string;        // Just-written, wet sheen
  highlight: string;    // Amber wash, selections
}

/**
 * Default ink palette values
 */
export const INK_PALETTE: InkPalette = {
  primary: '#1a1208',
  secondary: '#3d2914',
  faded: '#8b7355',
  blot: '#0d0906',
  fresh: '#2c1810',
  highlight: 'rgba(184, 142, 58, 0.3)',
};

/**
 * Animation timing constants
 */
export interface InkTiming {
  fast: number;       // Quick micro-interactions
  normal: number;     // Standard transitions
  slow: number;       // Noticeable animations
  dramatic: number;   // Full effect sequences
}

export const INK_TIMING: InkTiming = {
  fast: 150,
  normal: 300,
  slow: 600,
  dramatic: 1200,
};

/**
 * Common size variants
 */
export type InkSize = 'sm' | 'md' | 'lg';

/**
 * Size dimensions in pixels
 */
export const INK_SIZES: Record<InkSize, number> = {
  sm: 24,
  md: 40,
  lg: 64,
};

/**
 * SVG filter IDs for ink effects
 */
export type InkFilter =
  | 'paper-bleed-filter'
  | 'ink-spread-filter'
  | 'wet-sheen-filter'
  | 'ink-drop-filter'
  | 'ink-swirl-filter'
  | 'blotting-filter'
  | 'aged-ink-filter'
  | 'ink-wash-filter'
  | 'ink-pool-filter'
  | 'selection-bleed-filter';

/**
 * Helper to get filter URL
 */
export function getInkFilter(filter: InkFilter): string {
  return `url(#${filter})`;
}

/**
 * Common props shared across ink components
 */
export interface InkBaseProps {
  /** Additional CSS class */
  className?: string;
  /** Accessible label for screen readers */
  ariaLabel?: string;
}

/**
 * Props for loading state component
 */
export interface InkDropProps extends InkBaseProps {
  active: boolean;
  size?: InkSize;
}

/**
 * Props for error state component
 */
export interface InkBlotProps extends InkBaseProps {
  message?: string;
  onDismiss?: () => void;
  showDismiss?: boolean;
  autoDismissAfter?: number;
}

/**
 * Props for processing state component
 */
export interface InkSwirlProps extends InkBaseProps {
  active: boolean;
  size?: number;
}

/**
 * Props for page transition component
 */
export interface InkWashProps {
  children: ReactNode;
  trigger: boolean;
  direction?: 'in' | 'out';
  onComplete?: () => void;
  duration?: number;
  className?: string;
}

/**
 * Ink wash hook return type
 */
export interface UseInkWashReturn {
  trigger: boolean;
  direction: 'in' | 'out';
  isWashing: boolean;
  triggerWash: (direction?: 'in' | 'out') => void;
  reset: () => void;
}

/**
 * Animation configuration for GSAP timelines
 */
export interface InkAnimationConfig {
  duration: number;
  ease: string;
  repeat?: number;
  yoyo?: boolean;
  delay?: number;
}

/**
 * Default animation configs
 */
export const INK_ANIMATION_CONFIGS = {
  drop: {
    duration: 1.2,
    ease: 'power2.out',
    repeat: -1,
  },
  spread: {
    duration: 0.6,
    ease: 'power2.out',
  },
  swirl: {
    duration: 2,
    ease: 'none',
    repeat: -1,
  },
  absorb: {
    duration: 0.8,
    ease: 'power2.inOut',
  },
  wash: {
    duration: 1.2,
    ease: 'power2.inOut',
  },
} as const;
