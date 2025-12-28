import type { Variants, Transition, TargetAndTransition } from 'framer-motion';

// Skin types supported by Claude-RAG
export type SkinType = 'library' | 'cyberpunk' | 'brutalist' | 'glass';

// Component variant types - extending Variants for compatibility
export type ComponentVariants = Variants & {
  hidden: TargetAndTransition;
  visible: TargetAndTransition;
  exit?: TargetAndTransition;
  hover?: TargetAndTransition;
  tap?: TargetAndTransition;
  disabled?: TargetAndTransition;
};

// Transition presets
export interface TransitionPresets {
  default: Transition;
  fast: Transition;
  slow: Transition;
  spring: Transition;
}

// Stagger configuration
export interface StaggerConfig {
  children: number;
  delayChildren: number;
}

// Particle effect types
export type ParticleEffect = 'none' | 'subtle' | 'moderate' | 'intense' | 'dust' | 'data';

// Effects configuration
export interface EffectsConfig {
  particles: ParticleEffect;
  glow?: boolean;
  blur?: boolean;
  scanlines?: boolean;
  inkBleed?: boolean;
  glitch?: boolean;
  typewriter?: boolean;
  glowPulse?: boolean;
}

// Complete motion configuration for a skin
export interface SkinMotionConfig {
  // Basic states
  enter: TargetAndTransition;
  exit: TargetAndTransition;
  hover: TargetAndTransition;
  tap: TargetAndTransition;
  focus: TargetAndTransition;

  // Component variants
  card: ComponentVariants;
  modal: ComponentVariants;
  message: ComponentVariants;
  list: Variants;
  button: ComponentVariants;

  // Transitions
  transition: TransitionPresets;

  // Stagger
  stagger: StaggerConfig;

  // Effects
  effects: EffectsConfig;
}

// Motion context value
export interface MotionContextValue {
  skin: SkinType;
  motion: SkinMotionConfig;
  reducedMotion: boolean;
}

// Skin motion map type
export type SkinMotionMap = Record<SkinType, SkinMotionConfig>;
