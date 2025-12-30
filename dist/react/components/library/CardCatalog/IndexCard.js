import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * IndexCard Component
 * Physical index card with 3D perspective animations
 *
 * Interactions:
 * - Hover: Slight lift, shadow depth increases
 * - Select: Lifts forward out of stack, shadow intensifies
 * - Return: Settles back into position
 * - Fan: 3D perspective flip-through (controlled by parent)
 */
import { useRef, useCallback } from 'react';
import { gsap } from 'gsap';
// Animation timing
const TIMING = {
    hover: 0.15,
    select: 0.25,
    return: 0.3,
    fan: 0.2,
};
export function IndexCard({ card, index, isSelected, onSelect, onDeselect, stackOffset = 0, fanAngle = 0, className = '', }) {
    const cardRef = useRef(null);
    const shadowRef = useRef(null);
    const timelineRef = useRef(null);
    /**
     * Animate hover state - slight lift
     */
    const handleMouseEnter = useCallback(() => {
        if (!cardRef.current || !shadowRef.current || isSelected)
            return;
        timelineRef.current?.kill();
        const tl = gsap.timeline();
        timelineRef.current = tl;
        // Lift card slightly
        tl.to(cardRef.current, {
            y: -4,
            rotateX: 2,
            duration: TIMING.hover,
            ease: 'power2.out',
        }, 0);
        // Increase shadow depth
        tl.to(shadowRef.current, {
            opacity: 0.4,
            y: 6,
            scale: 1.02,
            duration: TIMING.hover,
            ease: 'power2.out',
        }, 0);
    }, [isSelected]);
    /**
     * Animate hover exit
     */
    const handleMouseLeave = useCallback(() => {
        if (!cardRef.current || !shadowRef.current || isSelected)
            return;
        timelineRef.current?.kill();
        const tl = gsap.timeline();
        timelineRef.current = tl;
        // Return to stack position
        tl.to(cardRef.current, {
            y: stackOffset,
            rotateX: 0,
            duration: TIMING.hover,
            ease: 'power2.inOut',
        }, 0);
        // Reset shadow
        tl.to(shadowRef.current, {
            opacity: 0.2,
            y: 2,
            scale: 1,
            duration: TIMING.hover,
            ease: 'power2.inOut',
        }, 0);
    }, [isSelected, stackOffset]);
    /**
     * Animate selection - lifts forward out of stack
     */
    const handleClick = useCallback(() => {
        if (!cardRef.current || !shadowRef.current)
            return;
        if (isSelected) {
            // Return to stack
            onDeselect();
            animateReturn();
        }
        else {
            // Select card
            onSelect(card);
            animateSelect();
        }
    }, [isSelected, card, onSelect, onDeselect]);
    /**
     * Select animation - lift forward
     */
    const animateSelect = useCallback(() => {
        if (!cardRef.current || !shadowRef.current)
            return;
        timelineRef.current?.kill();
        const tl = gsap.timeline();
        timelineRef.current = tl;
        // Lift card forward and up
        tl.to(cardRef.current, {
            y: -30,
            z: 60,
            rotateX: -5,
            scale: 1.05,
            duration: TIMING.select,
            ease: 'back.out(1.4)',
        }, 0);
        // Intensify shadow
        tl.to(shadowRef.current, {
            opacity: 0.5,
            y: 20,
            scale: 1.15,
            filter: 'blur(8px)',
            duration: TIMING.select,
            ease: 'power2.out',
        }, 0);
    }, []);
    /**
     * Return animation - settles back
     */
    const animateReturn = useCallback(() => {
        if (!cardRef.current || !shadowRef.current)
            return;
        timelineRef.current?.kill();
        const tl = gsap.timeline();
        timelineRef.current = tl;
        // Return to stack with slight overshoot
        tl.to(cardRef.current, {
            y: stackOffset,
            z: 0,
            rotateX: 0,
            scale: 1,
            duration: TIMING.return,
            ease: 'elastic.out(1, 0.5)',
        }, 0);
        // Reset shadow
        tl.to(shadowRef.current, {
            opacity: 0.2,
            y: 2,
            scale: 1,
            filter: 'blur(4px)',
            duration: TIMING.return,
            ease: 'power2.inOut',
        }, 0);
    }, [stackOffset]);
    /**
     * Format date for display
     */
    const formatDate = (date) => {
        if (!date)
            return '';
        try {
            return new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        }
        catch {
            return date;
        }
    };
    return (_jsxs("div", { className: `index-card-wrapper ${isSelected ? 'selected' : ''} ${className}`, style: {
            '--stack-offset': `${stackOffset}px`,
            '--fan-angle': `${fanAngle}deg`,
            '--card-index': index,
        }, children: [_jsx("div", { ref: shadowRef, className: "index-card-shadow" }), _jsxs("div", { ref: cardRef, className: "index-card", onClick: handleClick, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, style: {
                    transform: `translateY(${stackOffset}px) rotateZ(${fanAngle}deg)`,
                }, children: [_jsx("div", { className: "index-card-lines" }), _jsx("div", { className: "index-card-top-rule" }), _jsxs("div", { className: "index-card-content", children: [_jsx("div", { className: "index-card-title", children: card.title }), card.date && (_jsx("div", { className: "index-card-date", children: formatDate(card.date) })), _jsx("div", { className: "index-card-body", children: card.content })] }), _jsx("div", { className: "index-card-edge top" }), _jsx("div", { className: "index-card-edge bottom" }), _jsx("div", { className: "index-card-edge left" }), _jsx("div", { className: "index-card-edge right" }), _jsx("div", { className: "index-card-texture" })] })] }));
}
export default IndexCard;
//# sourceMappingURL=IndexCard.js.map