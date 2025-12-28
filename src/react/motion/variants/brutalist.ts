import type { SkinMotionConfig } from '../types.js';
import { DURATION, EASING, SPRING, STAGGER } from '../constants.js';

/**
 * Brutalist skin - harsh, direct, no-nonsense movements
 * Minimal easing, sharp transitions, raw feel
 */
export const brutalistMotion: SkinMotionConfig = {
  enter: { opacity: 1 },
  exit: { opacity: 0 },
  hover: { backgroundColor: 'var(--color-hover)' },
  tap: { scale: 0.98 },
  focus: { outline: '3px solid var(--color-text)' },

  card: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: DURATION.fast, ease: EASING.brutal }
    },
    exit: { opacity: 0, y: -20 },
    hover: { 
      y: -2,
      boxShadow: '4px 4px 0 var(--color-text)',
    },
    tap: { 
      y: 0,
      boxShadow: '2px 2px 0 var(--color-text)',
    },
  },

  modal: {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: DURATION.fast, ease: EASING.brutal }
    },
    exit: { opacity: 0, y: 50 },
  },

  message: {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: DURATION.fast, ease: EASING.brutal }
    },
    exit: { opacity: 0, x: 30 },
  },

  list: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: STAGGER.fast,
        delayChildren: 0,
      },
    },
    exit: { opacity: 0, transition: { duration: 0.1 } },
  },

  button: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.1 } },
    hover: {
      x: 2,
      y: 2,
      boxShadow: '2px 2px 0 var(--color-text)',
    },
    tap: {
      x: 4,
      y: 4,
      boxShadow: 'none',
    },
    disabled: { opacity: 0.4, textDecoration: 'line-through' },
  },

  transition: {
    default: { duration: DURATION.fast, ease: EASING.brutal },
    fast: { duration: 0.1, ease: EASING.brutal },
    slow: { duration: DURATION.normal, ease: EASING.brutal },
    spring: { type: 'spring', stiffness: 500, damping: 50 }, // Stiff, no bounce
  },

  stagger: {
    children: STAGGER.fast,
    delayChildren: 0,
  },

  effects: {
    particles: 'none',
  },
};
