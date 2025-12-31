import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * CyberpunkEffects - Post-processing pipeline
 *
 * Bloom, chromatic aberration, noise, vignette, and custom scanlines
 * Creates the damaged holographic terminal look
 */
import { useRef, useMemo, forwardRef, useLayoutEffect, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette, Scanline, } from '@react-three/postprocessing';
import { BlendFunction, Effect, ChromaticAberrationEffect } from 'postprocessing';
import * as THREE from 'three';
export function CyberpunkEffects({ quality = 'medium', bloomIntensity = 1.2, chromaticOffset = [0.003, 0.003], noiseOpacity = 0.08, vignetteDarkness = 0.7, scanlineDensity = 1.5, enableGlitch = true, }) {
    const glitchTimeRef = useRef(0);
    // Quality-based effect enablement:
    // low: Bloom + Vignette + Scanline (3 effects)
    // medium: + ChromaticAberration + Noise (5 effects)
    // high: + FlickerEffect (6 effects)
    const showChromatic = quality !== 'low';
    const showNoise = quality !== 'low';
    const showFlicker = quality === 'high';
    // Create chromatic aberration effect with useMemo (only if needed)
    const chromaticEffect = useMemo(() => {
        if (!showChromatic)
            return null;
        return new ChromaticAberrationEffect({
            offset: new THREE.Vector2(chromaticOffset[0], chromaticOffset[1]),
            radialModulation: false,
            modulationOffset: 0.5,
        });
    }, [showChromatic]); // Only recreate when quality changes
    // Update offset when props change
    useEffect(() => {
        if (chromaticEffect?.offset) {
            chromaticEffect.offset.set(chromaticOffset[0], chromaticOffset[1]);
        }
    }, [chromaticEffect, chromaticOffset]);
    // Animate chromatic aberration for glitch effect
    useFrame((state, delta) => {
        if (!enableGlitch || !chromaticEffect)
            return;
        glitchTimeRef.current += delta;
        // Random glitch spike every few seconds
        const glitchChance = Math.sin(glitchTimeRef.current * 15) > 0.97;
        if (glitchChance) {
            // Spike the chromatic aberration
            const spikeX = (Math.random() - 0.5) * 0.02;
            const spikeY = (Math.random() - 0.5) * 0.02;
            chromaticEffect.offset.set(chromaticOffset[0] + spikeX, chromaticOffset[1] + spikeY);
        }
        else {
            // Return to base offset
            chromaticEffect.offset.set(chromaticOffset[0], chromaticOffset[1]);
        }
    });
    // Cleanup effect on unmount
    useEffect(() => {
        return () => {
            chromaticEffect?.dispose();
        };
    }, [chromaticEffect]);
    return (_jsxs(EffectComposer, { disableNormalPass: true, multisampling: 0, children: [_jsx(Bloom, { luminanceThreshold: 0.2, luminanceSmoothing: 0.9, intensity: bloomIntensity, mipmapBlur: true, radius: 0.8 }), chromaticEffect && _jsx("primitive", { object: chromaticEffect }), _jsx(Scanline, { density: scanlineDensity, blendFunction: BlendFunction.OVERLAY }), showNoise && _jsx(Noise, { opacity: noiseOpacity, blendFunction: BlendFunction.SOFT_LIGHT }), _jsx(Vignette, { offset: 0.3, darkness: vignetteDarkness, blendFunction: BlendFunction.NORMAL }), showFlicker && _jsx(FlickerEffect, {})] }));
}
/**
 * Custom flicker effect - random brightness drops
 */
class FlickerEffectImpl extends Effect {
    constructor() {
        super('FlickerEffect', /* glsl */ `
      uniform float uTime;
      uniform float uIntensity;

      float random(float seed) {
        return fract(sin(seed * 12.9898) * 43758.5453);
      }

      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        // Base flicker - subtle constant variation
        float baseFlicker = 1.0 - random(floor(uTime * 30.0)) * 0.02 * uIntensity;

        // Occasional stronger flicker
        float strongFlicker = step(0.985, random(floor(uTime * 8.0)));
        float flickerAmount = strongFlicker * random(uTime) * 0.15 * uIntensity;

        float totalFlicker = baseFlicker - flickerAmount;

        outputColor = vec4(inputColor.rgb * totalFlicker, inputColor.a);
      }
    `, {
            uniforms: new Map([
                ['uTime', new THREE.Uniform(0)],
                ['uIntensity', new THREE.Uniform(1.0)],
            ]),
        });
    }
    update(_renderer, _inputBuffer, deltaTime) {
        const time = this.uniforms.get('uTime');
        if (time) {
            time.value += deltaTime;
        }
    }
}
const FlickerEffect = forwardRef((_, ref) => {
    const effect = useMemo(() => new FlickerEffectImpl(), []);
    useLayoutEffect(() => {
        return () => {
            effect.dispose();
        };
    }, [effect]);
    return _jsx("primitive", { ref: ref, object: effect });
});
FlickerEffect.displayName = 'FlickerEffect';
export default CyberpunkEffects;
//# sourceMappingURL=CyberpunkEffects.js.map