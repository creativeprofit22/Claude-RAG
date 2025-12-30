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
export type InkState = 'idle' | 'loading' | 'processing' | 'success' | 'error' | 'hover' | 'selection' | 'transition' | 'empty' | 'disabled';
/**
 * Ink color palette
 */
export interface InkPalette {
    primary: string;
    secondary: string;
    faded: string;
    blot: string;
    fresh: string;
    highlight: string;
}
/**
 * Default ink palette values
 */
export declare const INK_PALETTE: InkPalette;
/**
 * Animation timing constants
 */
export interface InkTiming {
    fast: number;
    normal: number;
    slow: number;
    dramatic: number;
}
export declare const INK_TIMING: InkTiming;
/**
 * Common size variants
 */
export type InkSize = 'sm' | 'md' | 'lg';
/**
 * Size dimensions in pixels
 */
export declare const INK_SIZES: Record<InkSize, number>;
/**
 * SVG filter IDs for ink effects
 */
export type InkFilter = 'paper-bleed-filter' | 'ink-spread-filter' | 'wet-sheen-filter' | 'ink-drop-filter' | 'ink-swirl-filter' | 'blotting-filter' | 'aged-ink-filter' | 'ink-wash-filter' | 'ink-pool-filter' | 'selection-bleed-filter';
/**
 * Helper to get filter URL
 */
export declare function getInkFilter(filter: InkFilter): string;
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
export declare const INK_ANIMATION_CONFIGS: {
    readonly drop: {
        readonly duration: 1.2;
        readonly ease: "power2.out";
        readonly repeat: -1;
    };
    readonly spread: {
        readonly duration: 0.6;
        readonly ease: "power2.out";
    };
    readonly swirl: {
        readonly duration: 2;
        readonly ease: "none";
        readonly repeat: -1;
    };
    readonly absorb: {
        readonly duration: 0.8;
        readonly ease: "power2.inOut";
    };
    readonly wash: {
        readonly duration: 1.2;
        readonly ease: "power2.inOut";
    };
};
//# sourceMappingURL=ink.types.d.ts.map