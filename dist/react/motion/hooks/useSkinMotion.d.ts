import type { SkinMotionConfig, MotionContextValue } from '../types.js';
export declare const reducedMotionConfig: SkinMotionConfig;
export type { MotionContextValue as UseSkinMotionReturn } from '../types.js';
/**
 * Primary hook for accessing current skin's motion configuration
 * Automatically respects prefers-reduced-motion
 */
export declare function useSkinMotion(): MotionContextValue;
//# sourceMappingURL=useSkinMotion.d.ts.map