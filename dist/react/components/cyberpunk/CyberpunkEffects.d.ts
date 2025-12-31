/**
 * CyberpunkEffects - Post-processing pipeline
 *
 * Bloom, chromatic aberration, noise, vignette, and custom scanlines
 * Creates the damaged holographic terminal look
 */
type QualityLevel = 'low' | 'medium' | 'high';
interface CyberpunkEffectsProps {
    /** Quality level - controls number of effects (low=3, medium=5, high=6) */
    quality?: QualityLevel;
    /** Bloom intensity (0-2) */
    bloomIntensity?: number;
    /** Chromatic aberration offset */
    chromaticOffset?: [number, number];
    /** Film grain noise (0-1) */
    noiseOpacity?: number;
    /** Vignette darkness (0-1) */
    vignetteDarkness?: number;
    /** Scanline density */
    scanlineDensity?: number;
    /** Enable random glitch spikes */
    enableGlitch?: boolean;
}
export declare function CyberpunkEffects({ quality, bloomIntensity, chromaticOffset, noiseOpacity, vignetteDarkness, scanlineDensity, enableGlitch, }: CyberpunkEffectsProps): import("react/jsx-runtime").JSX.Element;
export default CyberpunkEffects;
//# sourceMappingURL=CyberpunkEffects.d.ts.map