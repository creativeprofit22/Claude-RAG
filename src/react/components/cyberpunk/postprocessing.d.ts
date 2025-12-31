/**
 * Type declarations for @react-three/postprocessing
 *
 * These are needed because the package's exports field doesn't include
 * separate type definitions for NodeNext module resolution.
 */

declare module '@react-three/postprocessing' {
  import { ReactNode, RefObject, ForwardRefExoticComponent, RefAttributes } from 'react';
  import { Effect, BlendFunction } from 'postprocessing';
  import { Vector2 } from 'three';

  export interface EffectComposerProps {
    children?: ReactNode;
    depthBuffer?: boolean;
    disableNormalPass?: boolean;
    stencilBuffer?: boolean;
    autoClear?: boolean;
    multisampling?: number;
    frameBufferType?: number;
    enabled?: boolean;
    renderPriority?: number;
    camera?: THREE.Camera;
    scene?: THREE.Scene;
  }

  export const EffectComposer: ForwardRefExoticComponent<EffectComposerProps & RefAttributes<unknown>>;

  export interface BloomProps {
    intensity?: number;
    luminanceThreshold?: number;
    luminanceSmoothing?: number;
    mipmapBlur?: boolean;
    radius?: number;
    levels?: number;
    blendFunction?: BlendFunction;
  }

  export const Bloom: ForwardRefExoticComponent<BloomProps & RefAttributes<Effect>>;

  export interface ChromaticAberrationProps {
    offset?: Vector2;
    radialModulation?: boolean;
    modulationOffset?: number;
    blendFunction?: BlendFunction;
  }

  export const ChromaticAberration: ForwardRefExoticComponent<ChromaticAberrationProps & RefAttributes<Effect>>;

  export interface NoiseProps {
    premultiply?: boolean;
    opacity?: number;
    blendFunction?: BlendFunction;
  }

  export const Noise: ForwardRefExoticComponent<NoiseProps & RefAttributes<Effect>>;

  export interface VignetteProps {
    offset?: number;
    darkness?: number;
    blendFunction?: BlendFunction;
    eskil?: boolean;
  }

  export const Vignette: ForwardRefExoticComponent<VignetteProps & RefAttributes<Effect>>;

  export interface ScanlineProps {
    density?: number;
    blendFunction?: BlendFunction;
  }

  export const Scanline: ForwardRefExoticComponent<ScanlineProps & RefAttributes<Effect>>;
}
