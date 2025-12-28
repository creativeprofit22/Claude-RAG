import { ReactNode } from 'react';
import type { SkinType, MotionContextValue } from '../types.js';
interface MotionProviderProps {
    children: ReactNode;
    /** Override skin detection (useful for testing) */
    forceSkin?: SkinType;
    /** Override reduced motion (useful for testing) */
    forceReducedMotion?: boolean;
}
/**
 * Provides motion context and LazyMotion wrapper for the app
 * Place at the root of your React tree
 */
export declare function MotionProvider({ children, forceSkin, forceReducedMotion, }: MotionProviderProps): import("react/jsx-runtime").JSX.Element;
/**
 * Access motion context from any component
 * Must be used within MotionProvider
 */
export declare function useMotionContext(): MotionContextValue;
export {};
//# sourceMappingURL=MotionProvider.d.ts.map