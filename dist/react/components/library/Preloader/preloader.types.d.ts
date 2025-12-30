/**
 * LibraryPreloader - Type Definitions
 * Library Skin V2: "The Library Opens" Sequence
 */
export interface LibraryPreloaderProps {
    /** Called when animation finishes or is skipped */
    onComplete: () => void;
    /** Text to type during sequence. Default: "Welcome to the Library..." */
    welcomeText?: string;
    /** Play typing sounds during sequence */
    soundEnabled?: boolean;
    /** Ignore localStorage skip flag (for demo/testing) */
    forceShow?: boolean;
    /** Optional CSS class name */
    className?: string;
}
export interface PreloaderState {
    /** Whether preloader should be shown (based on localStorage/reduced motion) */
    shouldShow: boolean;
    /** Whether user has seen preloader before */
    hasSeenBefore: boolean;
    /** Whether reduced motion is preferred */
    prefersReducedMotion: boolean;
    /** Current animation frame (0-5) */
    currentFrame: number;
    /** Whether skip button is visible */
    skipVisible: boolean;
    /** Whether animation has completed */
    isComplete: boolean;
}
/** Animation frame phases */
export type PreloaderFrame = 'black' | 'glow' | 'desk' | 'paper' | 'typing' | 'complete';
export interface PreloaderTimeline {
    frame: PreloaderFrame;
    startTime: number;
    duration: number;
}
/** Color tokens for the preloader */
export declare const PRELOADER_COLORS: {
    readonly black: "#000000";
    readonly amberGlow: "rgba(255, 248, 230, 0.6)";
    readonly amberGlowIntense: "rgba(255, 248, 230, 0.9)";
    readonly shadow: "rgba(62, 39, 12, 0.4)";
    readonly warmWhite: "#fff8e6";
    readonly deskWood: "#3a2510";
    readonly deskWoodLight: "#5a3a20";
    readonly typewriterMetal: "#2a2a2a";
    readonly typewriterAccent: "#1a1a1a";
    readonly paper: "#f5f0e1";
    readonly ink: "#1a1a1a";
};
/** Timing constants in milliseconds */
export declare const PRELOADER_TIMING: {
    readonly frame1: {
        readonly start: 0;
        readonly duration: 500;
    };
    readonly frame2: {
        readonly start: 500;
        readonly duration: 500;
    };
    readonly frame3: {
        readonly start: 1000;
        readonly duration: 500;
    };
    readonly frame4: {
        readonly start: 1500;
        readonly duration: 500;
    };
    readonly frame5: {
        readonly start: 2000;
        readonly duration: 500;
    };
    readonly frame6: {
        readonly start: 2500;
        readonly duration: 500;
    };
    readonly skipButtonDelay: 1000;
    readonly totalDuration: 3000;
    readonly characterDelay: 50;
};
/** localStorage key for tracking first view */
export declare const STORAGE_KEY = "library-preloader-seen";
//# sourceMappingURL=preloader.types.d.ts.map