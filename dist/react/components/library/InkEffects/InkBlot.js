import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * InkBlot Component
 * Library Skin V2: Typewriter Edition
 *
 * Error state indicator that displays a spreading ink blot,
 * with blotting paper absorption for recoverable error feel.
 *
 * Tech stack: React + GSAP + SVG Filters
 */
import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import './InkEffects.css';
/**
 * InkBlot - An error state indicator styled as a spreading ink blot.
 *
 * The animation shows:
 * 1. Ink blot appears and spreads organically
 * 2. Small splatter drops appear around the main blot
 * 3. Blot slowly morphs (breathing effect)
 * 4. On dismiss: blotting paper overlay absorbs the ink
 *
 * @example
 * ```tsx
 * <InkBlot
 *   message="Something went wrong"
 *   onDismiss={() => clearError()}
 * />
 * ```
 */
export function InkBlot({ message = 'An error occurred', onDismiss, showDismiss = true, className = '', autoDismissAfter = 0, }) {
    const containerRef = useRef(null);
    const blobRef = useRef(null);
    const [isRecovering, setIsRecovering] = useState(false);
    const timelineRef = useRef(null);
    // Initial appearance animation
    useEffect(() => {
        if (!blobRef.current)
            return;
        const tl = gsap.timeline();
        timelineRef.current = tl;
        // Blob spreads in from center
        tl.fromTo(blobRef.current, {
            scale: 0,
            opacity: 0,
        }, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
        });
        // Splatter drops pop in with delay
        const splatters = containerRef.current?.querySelectorAll('.ink-blot__splatter');
        if (splatters) {
            tl.fromTo(splatters, {
                scale: 0,
                opacity: 0,
            }, {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                ease: 'back.out(2)',
                stagger: 0.1,
            }, '-=0.2');
        }
        return () => {
            tl.kill();
        };
    }, []);
    // Auto-dismiss timer
    useEffect(() => {
        if (autoDismissAfter > 0 && onDismiss) {
            const timer = setTimeout(() => {
                handleDismiss();
            }, autoDismissAfter);
            return () => clearTimeout(timer);
        }
    }, [autoDismissAfter, onDismiss]);
    /**
     * Handle dismiss with blotting paper absorption animation
     */
    const handleDismiss = useCallback(() => {
        if (isRecovering)
            return;
        setIsRecovering(true);
        // Absorption animation
        const tl = gsap.timeline({
            onComplete: () => {
                onDismiss?.();
            },
        });
        if (blobRef.current) {
            tl.to(blobRef.current, {
                scale: 0.85,
                opacity: 0.2,
                filter: 'url(#blotting-filter)',
                duration: 0.8,
                ease: 'power2.inOut',
            });
        }
        // Fade out entire container
        if (containerRef.current) {
            tl.to(containerRef.current, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
            }, '-=0.1');
        }
    }, [isRecovering, onDismiss]);
    return (_jsxs("div", { ref: containerRef, className: `ink-blot ${isRecovering ? 'ink-blot--recovering' : ''} ${className}`, role: "alert", "aria-live": "assertive", children: [_jsxs("div", { ref: blobRef, className: "ink-blot__blob", "aria-hidden": "true", children: [_jsx("div", { className: "ink-blot__splatter" }), _jsx("div", { className: "ink-blot__splatter" }), _jsx("div", { className: "ink-blot__splatter" })] }), _jsx("div", { className: "ink-blot__blotter", "aria-hidden": "true" }), message && (_jsx("p", { className: "ink-blot__message", children: message })), showDismiss && onDismiss && (_jsx("button", { type: "button", className: "ink-blot__dismiss", onClick: handleDismiss, disabled: isRecovering, "aria-label": "Dismiss error", children: "Blot away" }))] }));
}
export default InkBlot;
//# sourceMappingURL=InkBlot.js.map