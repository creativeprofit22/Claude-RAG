/**
 * TypewriterInput - Type Definitions
 * Library Skin V2: Typewriter Edition
 */

export interface TypewriterInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  soundEnabled?: boolean;
  showKeyboard?: boolean; // Desktop: true, Mobile: false
  className?: string;
}

export interface TypewriterState {
  activeKey: string | null;
  isTyping: boolean;
  carriagePosition: number; // Character offset from left
  correctionTapeActive: boolean;
  bellRinging: boolean;
}

export interface KeyPressEvent {
  key: string;
  timestamp: number;
  isBackspace: boolean;
  isEnter: boolean;
  isSpace: boolean;
}

export interface TypebarAnimationConfig {
  swingDuration: number;    // ms
  returnDuration: number;   // ms
  strikePause: number;      // ms at apex
  easing: string;           // GSAP easing
}

export interface CorrectionTapeConfig {
  deployDuration: number;   // ms
  coverDuration: number;    // ms for tape to cover char
  retractDuration: number;  // ms
  rapidModeThreshold: number; // ms between backspaces for rapid mode
}

export interface SoundConfig {
  enabled: boolean;
  volume: number;           // 0-1
  variationCount: number;   // Number of sound variations
  pitchVariation: number;   // +/- percentage
}

// Animation timeline phases
export type AnimationPhase =
  | 'idle'
  | 'key-down'
  | 'typebar-swing'
  | 'strike'
  | 'carriage-shift'
  | 'typebar-return'
  | 'key-up'
  | 'correction-deploy'
  | 'correction-cover'
  | 'correction-retract'
  | 'carriage-return'
  | 'bell';

// SVG element refs for GSAP targeting
export interface TypewriterRefs {
  paper: React.RefObject<SVGGElement>;
  carriage: React.RefObject<SVGGElement>;
  typebarBasket: React.RefObject<SVGGElement>;
  activeTypebar: React.RefObject<SVGGElement>;
  correctionArm: React.RefObject<SVGGElement>;
  correctionTape: React.RefObject<SVGRectElement>;
  keys: Map<string, React.RefObject<SVGGElement>>;
  bell: React.RefObject<SVGGElement>;
  ribbon: React.RefObject<SVGGElement>;
}
