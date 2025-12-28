'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { useSkinMotion, reducedMotionConfig } from '../hooks/useSkinMotion.js';
import { skinMotionMap } from '../variants/index.js';
import { initGSAP } from '../gsap-init.js';
// Initialize GSAP once
if (typeof window !== 'undefined') {
    initGSAP();
}
const MotionContext = createContext(null);
/**
 * Provides motion context and LazyMotion wrapper for the app
 * Place at the root of your React tree
 */
export function MotionProvider({ children, forceSkin, forceReducedMotion, }) {
    const { skin, motion, reducedMotion } = useSkinMotion();
    // Compute effective values respecting force props
    const effectiveSkin = forceSkin ?? skin;
    const effectiveReducedMotion = forceReducedMotion ?? reducedMotion;
    // Motion config priority: forceReducedMotion > forceSkin > detected
    const effectiveMotion = useMemo(() => {
        if (effectiveReducedMotion)
            return reducedMotionConfig;
        if (forceSkin)
            return skinMotionMap[forceSkin];
        return motion;
    }, [effectiveReducedMotion, forceSkin, motion]);
    const value = {
        skin: effectiveSkin,
        motion: effectiveMotion,
        reducedMotion: effectiveReducedMotion,
    };
    return (_jsx(MotionContext.Provider, { value: value, children: _jsx(LazyMotion, { features: domAnimation, strict: true, children: children }) }));
}
/**
 * Access motion context from any component
 * Must be used within MotionProvider
 */
export function useMotionContext() {
    const context = useContext(MotionContext);
    if (!context) {
        throw new Error('useMotionContext must be used within MotionProvider');
    }
    return context;
}
//# sourceMappingURL=MotionProvider.js.map