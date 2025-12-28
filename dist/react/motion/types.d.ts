import type { Variants, Transition, TargetAndTransition } from 'framer-motion';
export type SkinType = 'library' | 'cyberpunk' | 'brutalist' | 'glass';
export type ComponentVariants = Variants & {
    hidden: TargetAndTransition;
    visible: TargetAndTransition;
    exit?: TargetAndTransition;
    hover?: TargetAndTransition;
    tap?: TargetAndTransition;
    disabled?: TargetAndTransition;
};
export interface TransitionPresets {
    default: Transition;
    fast: Transition;
    slow: Transition;
    spring: Transition;
}
export interface StaggerConfig {
    children: number;
    delayChildren: number;
}
export type ParticleEffect = 'none' | 'subtle' | 'moderate' | 'intense' | 'dust' | 'data';
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
export interface SkinMotionConfig {
    enter: TargetAndTransition;
    exit: TargetAndTransition;
    hover: TargetAndTransition;
    tap: TargetAndTransition;
    focus: TargetAndTransition;
    card: ComponentVariants;
    modal: ComponentVariants;
    message: ComponentVariants;
    list: Variants;
    button: ComponentVariants;
    transition: TransitionPresets;
    stagger: StaggerConfig;
    effects: EffectsConfig;
}
export interface MotionContextValue {
    skin: SkinType;
    motion: SkinMotionConfig;
    reducedMotion: boolean;
}
export type SkinMotionMap = Record<SkinType, SkinMotionConfig>;
//# sourceMappingURL=types.d.ts.map