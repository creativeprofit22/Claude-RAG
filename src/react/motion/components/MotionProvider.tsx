'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';
import type { SkinType, SkinMotionConfig, MotionContextValue } from '../types.js';
import { useSkinMotion, reducedMotionConfig } from '../hooks/useSkinMotion.js';
import { skinMotionMap } from '../variants/index.js';
import { initGSAP } from '../gsap-init.js';

// Initialize GSAP once
if (typeof window !== 'undefined') {
  initGSAP();
}

const MotionContext = createContext<MotionContextValue | null>(null);

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
export function MotionProvider({
  children,
  forceSkin,
  forceReducedMotion,
}: MotionProviderProps) {
  const { skin, motion, reducedMotion } = useSkinMotion();

  // Compute effective values respecting force props
  const effectiveSkin = forceSkin ?? skin;
  const effectiveReducedMotion = forceReducedMotion ?? reducedMotion;

  // Motion config priority: forceReducedMotion > forceSkin > detected
  const effectiveMotion = useMemo(() => {
    if (effectiveReducedMotion) return reducedMotionConfig;
    if (forceSkin) return skinMotionMap[forceSkin];
    return motion;
  }, [effectiveReducedMotion, forceSkin, motion]);

  const value: MotionContextValue = {
    skin: effectiveSkin,
    motion: effectiveMotion,
    reducedMotion: effectiveReducedMotion,
  };

  return (
    <MotionContext.Provider value={value}>
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionContext.Provider>
  );
}

/**
 * Access motion context from any component
 * Must be used within MotionProvider
 */
export function useMotionContext(): MotionContextValue {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error('useMotionContext must be used within MotionProvider');
  }
  return context;
}
