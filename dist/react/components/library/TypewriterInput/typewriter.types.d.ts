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
    showKeyboard?: boolean;
    className?: string;
}
export interface TypewriterState {
    activeKey: string | null;
    isTyping: boolean;
    carriagePosition: number;
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
    swingDuration: number;
    returnDuration: number;
    strikePause: number;
    easing: string;
}
export interface CorrectionTapeConfig {
    deployDuration: number;
    coverDuration: number;
    retractDuration: number;
    rapidModeThreshold: number;
}
export interface SoundConfig {
    enabled: boolean;
    volume: number;
    variationCount: number;
    pitchVariation: number;
}
export type AnimationPhase = 'idle' | 'key-down' | 'typebar-swing' | 'strike' | 'carriage-shift' | 'typebar-return' | 'key-up' | 'correction-deploy' | 'correction-cover' | 'correction-retract' | 'carriage-return' | 'bell';
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
//# sourceMappingURL=typewriter.types.d.ts.map