/**
 * useTypewriterSound Hook
 * Library Skin V2: Typewriter Edition
 *
 * Production-quality synthesized typewriter sounds using Web Audio API.
 *
 * Features:
 * - Realistic mechanical typewriter sounds (keystroke, space, backspace, bell, carriage return)
 * - Multiple variations per sound with pitch randomization
 * - ADSR envelopes for realistic attack/decay
 * - Noise components for mechanical textures
 * - Tab visibility handling (auto-mute when hidden)
 * - localStorage preference for mute state
 * - prefers-reduced-motion respect
 * - First interaction gate (audioContext.resume() on user gesture)
 */
import type { SoundConfig } from './typewriter.types.js';
export type SoundType = 'keystroke' | 'space' | 'backspace' | 'carriageReturn' | 'bell' | 'drawerOpen' | 'drawerClose';
export declare function useTypewriterSound(config?: Partial<SoundConfig>): {
    playSound: (type: SoundType) => void;
    setMuted: (muted: boolean) => void;
    toggleMute: () => void;
    setVolume: (newVolume: number) => void;
    preloadSounds: () => void;
    initAudio: () => void;
    registerInteraction: () => void;
    isMuted: boolean;
    volume: number;
    isVisible: boolean;
};
//# sourceMappingURL=useTypewriterSound.d.ts.map