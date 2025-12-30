/**
 * InkEffects - Type Definitions
 * Library Skin V2: Typewriter Edition
 *
 * Shared types for ink visual language components.
 */
/**
 * Default ink palette values
 */
export const INK_PALETTE = {
    primary: '#1a1208',
    secondary: '#3d2914',
    faded: '#8b7355',
    blot: '#0d0906',
    fresh: '#2c1810',
    highlight: 'rgba(184, 142, 58, 0.3)',
};
export const INK_TIMING = {
    fast: 150,
    normal: 300,
    slow: 600,
    dramatic: 1200,
};
/**
 * Size dimensions in pixels
 */
export const INK_SIZES = {
    sm: 24,
    md: 40,
    lg: 64,
};
/**
 * Helper to get filter URL
 */
export function getInkFilter(filter) {
    return `url(#${filter})`;
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
};
//# sourceMappingURL=ink.types.js.map