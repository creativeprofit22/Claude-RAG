import { useMemo } from 'react';
import type { SkinType, SkinMotionConfig, MotionContextValue } from '../types.js';
import { useSkinDetect } from './useSkinDetect.js';
import { useReducedMotion } from './useReducedMotion.js';
import { skinMotionMap } from '../variants/index.js';

// Minimal motion config for reduced motion preference
export const reducedMotionConfig: SkinMotionConfig = {
  enter: { opacity: 1 },
  exit: { opacity: 0 },
  hover: {},
  tap: {},
  focus: {},
  
  card: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  modal: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  message: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  list: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  
  button: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  
  transition: {
    default: { duration: 0 },
    fast: { duration: 0 },
    slow: { duration: 0 },
    spring: { duration: 0 },
  },
  
  stagger: {
    children: 0,
    delayChildren: 0,
  },
  
  effects: {
    particles: 'none',
  },
};

// Re-export MotionContextValue as UseSkinMotionReturn for hook return type
export type { MotionContextValue as UseSkinMotionReturn } from '../types.js';

/**
 * Primary hook for accessing current skin's motion configuration
 * Automatically respects prefers-reduced-motion
 */
export function useSkinMotion(): MotionContextValue {
  const skin = useSkinDetect();
  const isReducedMotion = useReducedMotion();

  const motion = useMemo(() => {
    if (isReducedMotion) return reducedMotionConfig;
    return skinMotionMap[skin];
  }, [skin, isReducedMotion]);

  return { skin, motion, reducedMotion: isReducedMotion };
}
