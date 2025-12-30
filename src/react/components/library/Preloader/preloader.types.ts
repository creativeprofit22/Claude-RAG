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
export type PreloaderFrame =
  | 'black'           // 0-500ms: Black screen, lamp chain pull
  | 'glow'            // 500-1000ms: Amber glow spreads
  | 'desk'            // 1000-1500ms: Desk/typewriter materialize
  | 'paper'           // 1500-2000ms: Paper rolls into typewriter
  | 'typing'          // 2000-2500ms: Keys type welcome text
  | 'complete';       // 2500-3000ms: Carriage return, UI fades in

export interface PreloaderTimeline {
  frame: PreloaderFrame;
  startTime: number;
  duration: number;
}

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
} as const;

/** Timing constants in milliseconds */
export const PRELOADER_TIMING = {
  frame1: { start: 0, duration: 500 },       // Black -> lamp pull
  frame2: { start: 500, duration: 500 },     // Glow spreads
  frame3: { start: 1000, duration: 500 },    // Desk materializes
  frame4: { start: 1500, duration: 500 },    // Paper rolls in
  frame5: { start: 2000, duration: 500 },    // Typing animation
  frame6: { start: 2500, duration: 500 },    // Carriage return, fade out
  skipButtonDelay: 1000,                     // When skip appears
  totalDuration: 3000,
  characterDelay: 50,                        // Delay between typed chars
} as const;

/** localStorage key for tracking first view */
export const STORAGE_KEY = 'library-preloader-seen';
