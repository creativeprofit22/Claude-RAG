import { DURATION, EASING, SPRING, STAGGER } from '../constants.js';
/**
 * Glass skin - fluid, transparent, morphic movements
 * Smooth blurs, gentle scales, floating feel
 */
export const glassMotion = {
    enter: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 0.98, filter: 'blur(4px)' },
    hover: { scale: 1.01, filter: 'brightness(1.05)' },
    tap: { scale: 0.99 },
    focus: { boxShadow: '0 0 0 2px rgba(255,255,255,0.5)' },
    card: {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.95,
            filter: 'blur(10px)',
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            transition: { duration: DURATION.slow, ease: EASING.glass }
        },
        exit: {
            opacity: 0,
            y: -20,
            scale: 0.95,
            filter: 'blur(10px)',
        },
        hover: {
            y: -6,
            scale: 1.02,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        },
        tap: { scale: 0.98, y: -2 },
    },
    modal: {
        hidden: {
            opacity: 0,
            scale: 0.9,
            filter: 'blur(20px)',
        },
        visible: {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            transition: { ...SPRING.gentle, duration: DURATION.slow }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            filter: 'blur(20px)',
        },
    },
    message: {
        hidden: {
            opacity: 0,
            y: 20,
            scale: 0.9,
            filter: 'blur(8px)',
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            transition: { duration: DURATION.normal, ease: EASING.glass }
        },
        exit: {
            opacity: 0,
            y: -10,
            filter: 'blur(8px)',
            transition: { duration: DURATION.fast, ease: EASING.glass }
        },
    },
    list: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: STAGGER.slow,
                delayChildren: 0.15,
            },
        },
        exit: { opacity: 0, filter: 'blur(4px)', transition: { duration: DURATION.fast } },
    },
    button: {
        hidden: { opacity: 0, scale: 0.9, filter: 'blur(4px)' },
        visible: { opacity: 1, scale: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, scale: 0.95, filter: 'blur(4px)', transition: { duration: DURATION.fast } },
        hover: {
            scale: 1.05,
            filter: 'brightness(1.1)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        },
        tap: { scale: 0.95 },
        disabled: { opacity: 0.4, filter: 'blur(1px) grayscale(50%)' },
    },
    transition: {
        default: { duration: DURATION.normal, ease: EASING.glass },
        fast: { duration: DURATION.fast, ease: EASING.glass },
        slow: { duration: DURATION.slow, ease: EASING.glass },
        spring: SPRING.gentle,
    },
    stagger: {
        children: STAGGER.slow,
        delayChildren: 0.15,
    },
    effects: {
        particles: 'subtle',
        blur: true,
    },
};
//# sourceMappingURL=glass.js.map