// Motion constants and timing values
// Duration presets (in seconds)
export const DURATION = {
    instant: 0,
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
    glacial: 0.8,
};
// Easing presets
export const EASING = {
    // Standard easings
    linear: [0, 0, 1, 1],
    easeIn: [0.4, 0, 1, 1],
    easeOut: [0, 0, 0.2, 1],
    easeInOut: [0.4, 0, 0.2, 1],
    // Expressive easings
    anticipate: [0.36, 0, 0.66, -0.56],
    overshoot: [0.34, 1.56, 0.64, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
    // Skin-specific
    cyber: [0.25, 0.46, 0.45, 0.94],
    brutal: [0, 0, 1, 1], // Linear for brutalist
    glass: [0.23, 1, 0.32, 1],
};
// Spring presets
export const SPRING = {
    gentle: { type: 'spring', stiffness: 120, damping: 14 },
    snappy: { type: 'spring', stiffness: 300, damping: 20 },
    bouncy: { type: 'spring', stiffness: 400, damping: 10 },
    stiff: { type: 'spring', stiffness: 500, damping: 30 },
};
// Stagger presets (in seconds)
export const STAGGER = {
    none: 0,
    fast: 0.03,
    normal: 0.05,
    slow: 0.1,
};
// Z-index layers for motion elements
export const Z_INDEX = {
    base: 0,
    dropdown: 100,
    modal: 200,
    tooltip: 300,
    notification: 400,
    overlay: 500,
};
//# sourceMappingURL=constants.js.map