import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * TypewriterInput Component
 * Library Skin V2: Typewriter Edition
 *
 * A fully animated typewriter chat input with:
 * - Key depression animation
 * - Typebar swing mechanism
 * - Carriage movement
 * - Correction tape for backspace
 * - Sound effects
 *
 * Tech stack: React + GSAP + SVG + CSS
 */
import { useState, useRef, useCallback, useEffect, } from 'react';
import { gsap } from 'gsap';
import { useTypewriterSound } from './useTypewriterSound.js';
import { TypewriterSVG } from './TypewriterSVG.js';
import './TypewriterInput.css';
// Animation timing constants (ms)
const TIMING = {
    keyDown: 15,
    typebarSwing: 25,
    strike: 5,
    carriageShift: 20,
    typebarReturn: 20,
    keyUp: 15,
    correctionDeploy: 25,
    correctionCover: 30,
    correctionRetract: 20,
    carriageReturn: 300,
    bellRing: 150,
};
// Character width for carriage movement (px)
const CHAR_WIDTH = 8.4; // Approximate monospace character width
export function TypewriterInput({ value, onChange, onSubmit, placeholder = 'Type your message...', disabled = false, soundEnabled = true, showKeyboard = true, className = '', }) {
    // State
    const [state, setState] = useState({
        activeKey: null,
        isTyping: false,
        carriagePosition: 0,
        correctionTapeActive: false,
        bellRinging: false,
    });
    // Refs for GSAP targeting
    const containerRef = useRef(null);
    const textareaRef = useRef(null);
    const svgRef = useRef(null);
    // Sound hook
    const { playSound, initAudio } = useTypewriterSound({
        enabled: soundEnabled,
        volume: 0.3,
    });
    // Track current animation timeline
    const animationRef = useRef(null);
    // Last backspace time for rapid deletion detection
    const lastBackspaceRef = useRef(0);
    /**
     * Calculate carriage position based on current line length
     */
    const calculateCarriagePosition = useCallback((text) => {
        const lines = text.split('\n');
        const currentLine = lines[lines.length - 1] || '';
        return currentLine.length * CHAR_WIDTH;
    }, []);
    /**
     * Animate a key press using SVG refs
     */
    const animateKeyPress = useCallback((key, isDown) => {
        const keyElement = svgRef.current?.keys.get(key.toUpperCase());
        if (!keyElement)
            return;
        if (isDown) {
            gsap.to(keyElement, {
                y: 3,
                duration: TIMING.keyDown / 1000,
                ease: 'power2.out',
            });
        }
        else {
            gsap.to(keyElement, {
                y: 0,
                duration: TIMING.keyUp / 1000,
                ease: 'power2.out',
            });
        }
    }, []);
    /**
     * Animate typebar swing using SVG refs
     */
    const animateTypebar = useCallback(() => {
        // Get a random typebar to animate
        const typebarIndex = Math.floor(Math.random() * 5);
        const typebar = svgRef.current?.typebars[typebarIndex];
        if (!typebar)
            return;
        const tl = gsap.timeline();
        tl.to(typebar, {
            rotation: -35,
            duration: TIMING.typebarSwing / 1000,
            ease: 'power2.out',
            transformOrigin: 'bottom center',
        })
            .to(typebar, {
            rotation: 0,
            duration: TIMING.typebarReturn / 1000,
            ease: 'power2.inOut',
        });
        return tl;
    }, []);
    /**
     * Animate carriage shift using SVG refs
     * SVG carriage marker starts at x=85, moves based on character position
     */
    const animateCarriageShift = useCallback((direction) => {
        const carriage = svgRef.current?.carriage;
        if (!carriage)
            return;
        const newPosition = Math.max(0, state.carriagePosition + (direction === 'left' ? CHAR_WIDTH : -CHAR_WIDTH));
        // In SVG, we use transform to move the carriage marker
        gsap.to(carriage, {
            x: newPosition,
            duration: TIMING.carriageShift / 1000,
            ease: 'power2.out',
        });
        setState((prev) => ({ ...prev, carriagePosition: newPosition }));
    }, [state.carriagePosition]);
    /**
     * Animate correction tape deployment using SVG refs
     */
    const animateCorrectionTape = useCallback((rapid = false) => {
        const correctionArm = svgRef.current?.correctionArm;
        if (!correctionArm)
            return;
        const tl = gsap.timeline();
        if (!rapid) {
            // Full animation for single backspace
            tl.set(correctionArm, { opacity: 1 })
                .to(correctionArm, {
                rotation: -15,
                duration: TIMING.correctionDeploy / 1000,
                ease: 'power2.out',
                transformOrigin: 'right center',
            })
                .to(correctionArm, {
                rotation: 45,
                opacity: 0,
                duration: TIMING.correctionRetract / 1000,
                ease: 'power2.in',
                delay: TIMING.correctionCover / 1000,
            });
        }
        else {
            // Quick flash for rapid deletion
            tl.set(correctionArm, { opacity: 1, rotation: -15 });
        }
        return tl;
    }, []);
    /**
     * Animate carriage return (Enter key) using SVG refs
     */
    const animateCarriageReturn = useCallback(() => {
        const carriage = svgRef.current?.carriage;
        const bell = svgRef.current?.bell;
        if (!carriage || !bell)
            return;
        // Ring the bell
        setState((prev) => ({ ...prev, bellRinging: true }));
        playSound('bell');
        // Bell wiggle animation
        gsap.to(bell, {
            rotation: 5,
            duration: 0.05,
            yoyo: true,
            repeat: 3,
            ease: 'power1.inOut',
        });
        // Slam carriage right then reset
        const tl = gsap.timeline();
        tl.to(carriage, {
            x: 400, // Move to right side of paper area
            duration: TIMING.carriageReturn / 2000,
            ease: 'power3.in',
        })
            .to(carriage, {
            x: 0,
            duration: TIMING.carriageReturn / 2000,
            ease: 'power2.out',
        })
            // Reset bell state after bell ring duration
            .call(() => {
            setState((prev) => ({ ...prev, bellRinging: false }));
        }, [], `+=${TIMING.bellRing / 1000}`);
        return tl;
    }, [playSound]);
    /**
     * Full typing animation sequence
     */
    const triggerTypingAnimation = useCallback((key) => {
        // Kill any existing animation
        animationRef.current?.kill();
        // Start new timeline
        const tl = gsap.timeline();
        animationRef.current = tl;
        setState((prev) => ({ ...prev, activeKey: key, isTyping: true }));
        // 1. Key press down
        animateKeyPress(key, true);
        playSound('keystroke');
        // 2. Typebar swing (after key down completes)
        tl.add(animateTypebar() || [], `+=${TIMING.keyDown / 1000}`);
        // 3. Carriage shift (after strike)
        tl.call(() => animateCarriageShift('left'), [], `+=${TIMING.strike / 1000}`);
        // 4. Key release (after typebar return starts)
        tl.call(() => animateKeyPress(key, false), [], `+=${TIMING.typebarReturn / 1000}`);
        // 5. Reset state (after key up completes)
        tl.call(() => {
            setState((prev) => ({ ...prev, activeKey: null, isTyping: false }));
        }, [], `+=${TIMING.keyUp / 1000}`);
    }, [animateKeyPress, animateTypebar, animateCarriageShift, playSound]);
    /**
     * Backspace animation sequence
     */
    const triggerBackspaceAnimation = useCallback(() => {
        const now = Date.now();
        const timeSinceLastBackspace = now - lastBackspaceRef.current;
        lastBackspaceRef.current = now;
        // Detect rapid deletion (holding backspace)
        const isRapid = timeSinceLastBackspace < 100;
        // Carriage shift right
        animateCarriageShift('right');
        // Correction tape animation
        animateCorrectionTape(isRapid);
        // Sound
        playSound('backspace');
        setState((prev) => ({ ...prev, correctionTapeActive: true }));
        setTimeout(() => {
            setState((prev) => ({ ...prev, correctionTapeActive: false }));
        }, TIMING.correctionDeploy + TIMING.correctionCover + TIMING.correctionRetract);
    }, [animateCarriageShift, animateCorrectionTape, playSound]);
    /**
     * Handle input changes
     */
    const handleChange = useCallback((e) => {
        const newValue = e.target.value;
        const oldValue = value;
        // Detect what changed
        if (newValue.length > oldValue.length) {
            // Character added
            const newChar = newValue[newValue.length - 1];
            if (newChar === ' ') {
                playSound('space');
                animateCarriageShift('left');
            }
            else if (newChar !== '\n') {
                triggerTypingAnimation(newChar);
            }
        }
        else if (newValue.length < oldValue.length) {
            // Character removed (backspace)
            triggerBackspaceAnimation();
        }
        // Update carriage position
        const newCarriagePos = calculateCarriagePosition(newValue);
        setState((prev) => ({ ...prev, carriagePosition: newCarriagePos }));
        onChange(newValue);
    }, [
        value,
        onChange,
        triggerTypingAnimation,
        triggerBackspaceAnimation,
        animateCarriageShift,
        calculateCarriagePosition,
        playSound,
    ]);
    /**
     * Handle key down for special keys
     */
    const handleKeyDown = useCallback((e) => {
        // Initialize audio on first keypress
        initAudio();
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            animateCarriageReturn();
            playSound('carriageReturn');
            onSubmit?.(value);
        }
    }, [value, onSubmit, animateCarriageReturn, playSound, initAudio]);
    /**
     * Sync carriage position when value changes externally
     */
    useEffect(() => {
        const pos = calculateCarriagePosition(value);
        const carriage = svgRef.current?.carriage;
        if (carriage) {
            gsap.set(carriage, { x: pos });
        }
        setState((prev) => ({ ...prev, carriagePosition: pos }));
    }, [value, calculateCarriagePosition]);
    /**
     * Cleanup GSAP animations and timeouts on unmount
     */
    useEffect(() => {
        return () => {
            // Kill any running GSAP timeline
            animationRef.current?.kill();
        };
    }, []);
    return (_jsxs("div", { ref: containerRef, className: `typewriter-svg-container ${disabled ? 'disabled' : ''} ${className}`, children: [_jsx(TypewriterSVG, { ref: svgRef, showKeyboard: showKeyboard, className: "typewriter-svg-visual" }), _jsx("textarea", { ref: textareaRef, className: "typewriter-svg-textarea", value: value, onChange: handleChange, onKeyDown: handleKeyDown, placeholder: placeholder, disabled: disabled, rows: 4, "aria-label": "Chat message input" })] }));
}
export default TypewriterInput;
//# sourceMappingURL=TypewriterInput.js.map