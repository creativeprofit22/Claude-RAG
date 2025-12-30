import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * InkSwirl Component
 * Library Skin V2: Typewriter Edition
 *
 * Processing state indicator showing ink swirling in an inkwell.
 * Contained, cyclical animation for ongoing operations.
 *
 * Tech stack: React + GSAP + SVG Filters
 */
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './InkEffects.css';
/**
 * InkSwirl - A processing indicator styled as ink swirling in an inkwell.
 *
 * The animation shows:
 * 1. Brass-rimmed inkwell container
 * 2. Dark ink surface with wet sheen
 * 3. Spiral pattern continuously rotating
 * 4. Subtle organic distortion via SVG filter
 *
 * @example
 * ```tsx
 * <InkSwirl active={isProcessing} size={48} />
 * ```
 */
export function InkSwirl({ active, size = 64, className = '', ariaLabel = 'Processing...', }) {
    const containerRef = useRef(null);
    const patternRef = useRef(null);
    const timelineRef = useRef(null);
    useEffect(() => {
        if (!active || !patternRef.current) {
            // Kill animation when inactive
            timelineRef.current?.kill();
            timelineRef.current = null;
            return;
        }
        // Enhanced GSAP animation for smoother swirl
        const tl = gsap.timeline({ repeat: -1 });
        timelineRef.current = tl;
        // Continuous rotation with slight organic pulsing
        tl.to(patternRef.current, {
            rotation: 360,
            duration: 2,
            ease: 'none',
        });
        // Add subtle scale pulse for organic feel
        gsap.to(patternRef.current, {
            scale: 1.05,
            duration: 1.5,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
        });
        return () => {
            tl.kill();
            gsap.killTweensOf(patternRef.current);
        };
    }, [active]);
    // Entry/exit animations
    useEffect(() => {
        if (!containerRef.current)
            return;
        if (active) {
            gsap.fromTo(containerRef.current, {
                scale: 0.8,
                opacity: 0,
            }, {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                ease: 'back.out(1.5)',
            });
        }
    }, [active]);
    if (!active) {
        return null;
    }
    return (_jsxs("div", { ref: containerRef, className: `ink-swirl ink-swirl--active ${className}`, style: {
            width: size,
            height: size,
        }, role: "status", "aria-label": ariaLabel, "aria-live": "polite", children: [_jsx("div", { className: "ink-swirl__rim", "aria-hidden": "true" }), _jsx("div", { className: "ink-swirl__inkwell", "aria-hidden": "true", children: _jsxs("div", { className: "ink-swirl__ink", children: [_jsx("div", { ref: patternRef, className: "ink-swirl__pattern" }), _jsx("div", { className: "ink-swirl__sheen" })] }) })] }));
}
export default InkSwirl;
//# sourceMappingURL=InkSwirl.js.map