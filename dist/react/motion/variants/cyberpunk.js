import { DURATION, EASING, SPRING, STAGGER } from '../constants.js';
/**
 * Cyberpunk skin - glitchy, neon, high-tech movements
 * Features glitch effects, scan lines, and electric feel
 */
export const cyberpunkMotion = {
    enter: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, x: 10, filter: 'blur(2px)' },
    hover: { scale: 1.02, filter: 'brightness(1.1)' },
    tap: { scale: 0.98, filter: 'brightness(0.9)' },
    focus: { boxShadow: '0 0 20px var(--color-neon)' },
    card: {
        hidden: {
            opacity: 0,
            x: -30,
            skewX: -5,
            filter: 'blur(4px)',
        },
        visible: {
            opacity: 1,
            x: 0,
            skewX: 0,
            filter: 'blur(0px)',
            transition: { duration: DURATION.fast, ease: EASING.cyber }
        },
        exit: {
            opacity: 0,
            x: 30,
            skewX: 5,
            filter: 'blur(4px)',
        },
        hover: {
            scale: 1.02,
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.3)',
        },
        tap: { scale: 0.98 },
    },
    modal: {
        hidden: {
            opacity: 0,
            scale: 1.1,
            filter: 'blur(10px) brightness(2)',
        },
        visible: {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px) brightness(1)',
            transition: { duration: DURATION.fast, ease: EASING.cyber }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            filter: 'blur(10px) brightness(0)',
        },
    },
    message: {
        hidden: {
            opacity: 0,
            x: -40,
            scaleX: 0.8,
        },
        visible: {
            opacity: 1,
            x: 0,
            scaleX: 1,
            transition: { duration: DURATION.fast, ease: EASING.cyber }
        },
        exit: { opacity: 0, x: 40, transition: { duration: DURATION.fast, ease: EASING.cyber } },
    },
    list: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: STAGGER.fast,
                delayChildren: 0.05,
            },
        },
        exit: { opacity: 0, x: 20, transition: { duration: DURATION.fast } },
    },
    button: {
        hidden: { opacity: 0, scaleX: 0.5 },
        visible: { opacity: 1, scaleX: 1 },
        exit: { opacity: 0, scaleX: 0.5, filter: 'blur(2px)', transition: { duration: DURATION.fast } },
        hover: {
            scale: 1.05,
            filter: 'brightness(1.2)',
            boxShadow: '0 0 20px var(--color-neon)',
        },
        tap: { scale: 0.95, filter: 'brightness(0.8)' },
        disabled: { opacity: 0.3, filter: 'grayscale(100%)' },
    },
    transition: {
        default: { duration: DURATION.fast, ease: EASING.cyber },
        fast: { duration: 0.1, ease: EASING.cyber },
        slow: { duration: DURATION.normal, ease: EASING.cyber },
        spring: SPRING.snappy,
    },
    stagger: {
        children: STAGGER.fast,
        delayChildren: 0.05,
    },
    effects: {
        particles: 'moderate',
        glow: true,
        scanlines: true,
    },
};
//# sourceMappingURL=cyberpunk.js.map