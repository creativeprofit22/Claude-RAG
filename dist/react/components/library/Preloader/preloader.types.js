/**
 * LibraryPreloader - Type Definitions
 * Library Skin V2: "The Library Opens" Sequence
 */
/** Color tokens for the preloader */
export const PRELOADER_COLORS = {
    black: '#000000',
    amberGlow: 'rgba(255, 248, 230, 0.6)',
    amberGlowIntense: 'rgba(255, 248, 230, 0.9)',
    shadow: 'rgba(62, 39, 12, 0.4)',
    warmWhite: '#fff8e6',
    deskWood: '#3a2510',
    deskWoodLight: '#5a3a20',
    typewriterMetal: '#2a2a2a',
    typewriterAccent: '#1a1a1a',
    paper: '#f5f0e1',
    ink: '#1a1a1a',
};
/** Timing constants in milliseconds */
export const PRELOADER_TIMING = {
    frame1: { start: 0, duration: 500 }, // Black -> lamp pull
    frame2: { start: 500, duration: 500 }, // Glow spreads
    frame3: { start: 1000, duration: 500 }, // Desk materializes
    frame4: { start: 1500, duration: 500 }, // Paper rolls in
    frame5: { start: 2000, duration: 500 }, // Typing animation
    frame6: { start: 2500, duration: 500 }, // Carriage return, fade out
    skipButtonDelay: 1000, // When skip appears
    totalDuration: 3000,
    characterDelay: 50, // Delay between typed chars
};
/** localStorage key for tracking first view */
export const STORAGE_KEY = 'library-preloader-seen';
//# sourceMappingURL=preloader.types.js.map