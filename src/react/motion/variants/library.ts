import type { SkinMotionConfig } from '../types.js';
import { DURATION, EASING, SPRING, STAGGER } from '../constants.js';

/**
 * Library skin - warm, scholarly, paper-like movements
 * Inspired by page turns and book movements
 */
export const libraryMotion: SkinMotionConfig = {
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  hover: { scale: 1.02, y: -2 },
  tap: { scale: 0.98 },
  focus: { boxShadow: '0 0 0 2px var(--color-accent)' },

  card: {
    hidden: { opacity: 0, y: 20, rotateX: -5 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: { duration: DURATION.normal, ease: EASING.easeOut }
    },
    exit: { opacity: 0, y: -10, rotateX: 5 },
    hover: { y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.12)' },
    tap: { scale: 0.98, y: 0 },
  },

  modal: {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { ...SPRING.gentle }
    },
    exit: { opacity: 0, scale: 0.95, y: 10 },
  },

  message: {
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: DURATION.normal, ease: EASING.easeOut }
    },
    exit: { opacity: 0, x: 20, transition: { duration: DURATION.fast, ease: EASING.easeOut } },
  },

  list: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: STAGGER.normal,
        delayChildren: 0.1,
      },
    },
    exit: { opacity: 0, transition: { duration: DURATION.fast } },
  },

  button: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9, transition: { duration: DURATION.fast } },
    hover: { scale: 1.05, y: -1 },
    tap: { scale: 0.95 },
    disabled: { opacity: 0.5 },
  },

  transition: {
    default: { duration: DURATION.normal, ease: EASING.easeOut },
    fast: { duration: DURATION.fast, ease: EASING.easeOut },
    slow: { duration: DURATION.slow, ease: EASING.easeInOut },
    spring: SPRING.gentle,
  },

  stagger: {
    children: STAGGER.normal,
    delayChildren: 0.1,
  },

  effects: {
    particles: 'none',
  },
};
