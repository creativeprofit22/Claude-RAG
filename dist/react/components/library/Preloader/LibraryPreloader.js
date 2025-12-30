import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * LibraryPreloader Component
 * Library Skin V2: "The Library Opens" Sequence
 *
 * A premium opening curtain experience with:
 * - Banker's lamp chain pull and amber glow
 * - Desk surface and typewriter materialization
 * - Paper roll animation
 * - Character-by-character typing
 * - Carriage return bell for completion
 *
 * Tech stack: React + GSAP + CSS
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useTypewriterSound } from '../TypewriterInput/useTypewriterSound.js';
import { usePreloaderState } from './usePreloaderState.js';
import { PRELOADER_TIMING } from './preloader.types.js';
import './LibraryPreloader.css';
const DEFAULT_WELCOME_TEXT = 'Welcome to the Library...';
export function LibraryPreloader({ onComplete, welcomeText = DEFAULT_WELCOME_TEXT, soundEnabled = true, forceShow = false, className = '', }) {
    // State management
    const { shouldShow, prefersReducedMotion, markAsSeen, skipToEnd, wasSkipped, } = usePreloaderState({ forceShow });
    // Animation state
    const [currentFrame, setCurrentFrame] = useState('black');
    const [skipVisible, setSkipVisible] = useState(false);
    const [typedChars, setTypedChars] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    // Refs
    const containerRef = useRef(null);
    const timelineRef = useRef(null);
    const skipTimerRef = useRef(null);
    const hasStartedRef = useRef(false);
    // Sound hook
    const { playSound, initAudio } = useTypewriterSound({
        enabled: soundEnabled,
        volume: 0.25,
    });
    /**
     * Type characters one by one
     */
    const typeCharacters = useCallback((text, onTypingComplete) => {
        setIsTyping(true);
        const chars = text.split('');
        let index = 0;
        const typeNext = () => {
            if (index < chars.length) {
                setTypedChars((prev) => [...prev, chars[index]]);
                // Play keystroke sound for each character
                if (chars[index] !== ' ') {
                    playSound('keystroke');
                }
                else {
                    playSound('space');
                }
                index++;
                setTimeout(typeNext, PRELOADER_TIMING.characterDelay);
            }
            else {
                setIsTyping(false);
                onTypingComplete();
            }
        };
        typeNext();
    }, [playSound]);
    /**
     * Complete the animation sequence
     */
    const completeSequence = useCallback(() => {
        setIsCompleting(true);
        // Play carriage return bell
        playSound('bell');
        // Mark as seen for next visit
        markAsSeen();
        // Wait for fade out animation
        setTimeout(() => {
            onComplete();
        }, 500);
    }, [onComplete, markAsSeen, playSound]);
    /**
     * Skip button handler
     */
    const handleSkip = useCallback(() => {
        // Kill any running animations
        if (timelineRef.current) {
            timelineRef.current.kill();
        }
        // Clear skip timer
        if (skipTimerRef.current) {
            clearTimeout(skipTimerRef.current);
        }
        // Trigger skip
        skipToEnd();
        completeSequence();
    }, [skipToEnd, completeSequence]);
    /**
     * Main animation sequence using GSAP timeline
     */
    const startAnimationSequence = useCallback(() => {
        if (hasStartedRef.current)
            return;
        hasStartedRef.current = true;
        // Initialize audio on first interaction
        initAudio();
        const tl = gsap.timeline();
        timelineRef.current = tl;
        // Show skip button after delay
        skipTimerRef.current = setTimeout(() => {
            setSkipVisible(true);
        }, PRELOADER_TIMING.skipButtonDelay);
        // Frame 1: Black screen, lamp chain pull (0-500ms)
        tl.call(() => {
            setCurrentFrame('black');
        });
        // Frame 2: Amber glow spreads (500ms)
        tl.call(() => {
            setCurrentFrame('glow');
        }, [], PRELOADER_TIMING.frame2.start / 1000);
        // Frame 3: Desk and typewriter materialize (1000ms)
        tl.call(() => {
            setCurrentFrame('desk');
        }, [], PRELOADER_TIMING.frame3.start / 1000);
        // Frame 4: Paper rolls in (1500ms)
        tl.call(() => {
            setCurrentFrame('paper');
        }, [], PRELOADER_TIMING.frame4.start / 1000);
        // Frame 5: Typing animation (2000ms)
        tl.call(() => {
            setCurrentFrame('typing');
            typeCharacters(welcomeText, () => {
                // Typing complete, move to frame 6
                setCurrentFrame('complete');
            });
        }, [], PRELOADER_TIMING.frame5.start / 1000);
        // Frame 6: Completion (2500ms + typing time)
        const typingDuration = welcomeText.length * PRELOADER_TIMING.characterDelay;
        tl.call(() => {
            completeSequence();
        }, [], (PRELOADER_TIMING.frame6.start + typingDuration) / 1000);
    }, [welcomeText, typeCharacters, completeSequence, initAudio]);
    /**
     * Handle reduced motion - instant completion
     */
    useEffect(() => {
        if (!shouldShow) {
            onComplete();
            return;
        }
        if (prefersReducedMotion) {
            // Brief display then complete
            setTypedChars(welcomeText.split(''));
            setCurrentFrame('complete');
            const timer = setTimeout(() => {
                markAsSeen();
                onComplete();
            }, 500);
            return () => clearTimeout(timer);
        }
        // Start animation sequence
        startAnimationSequence();
        return () => {
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
            if (skipTimerRef.current) {
                clearTimeout(skipTimerRef.current);
            }
        };
    }, [
        shouldShow,
        prefersReducedMotion,
        welcomeText,
        markAsSeen,
        onComplete,
        startAnimationSequence,
    ]);
    /**
     * Handle skip trigger from hook
     */
    useEffect(() => {
        if (wasSkipped && !isCompleting) {
            handleSkip();
        }
    }, [wasSkipped, isCompleting, handleSkip]);
    // Don't render if shouldn't show
    if (!shouldShow) {
        return null;
    }
    // Determine frame-based active states
    const glowActive = currentFrame !== 'black';
    const deskActive = ['desk', 'paper', 'typing', 'complete'].includes(currentFrame);
    const typewriterActive = ['desk', 'paper', 'typing', 'complete'].includes(currentFrame);
    const paperActive = ['paper', 'typing', 'complete'].includes(currentFrame);
    const accessoriesActive = ['desk', 'paper', 'typing', 'complete'].includes(currentFrame);
    return (_jsxs("div", { ref: containerRef, className: `library-preloader ${isCompleting ? 'completing' : ''} ${prefersReducedMotion ? 'reduced-motion' : ''} ${className}`, role: "presentation", "aria-label": "Library opening sequence", children: [_jsx("div", { className: `preloader-lamp-chain ${currentFrame !== 'black' ? 'active' : ''}`, children: _jsx("div", { className: "preloader-lamp-pull" }) }), _jsx("div", { className: `preloader-glow ${glowActive ? 'active' : ''}` }), _jsx("div", { className: `preloader-desk ${deskActive ? 'active' : ''}` }), _jsxs("div", { className: `preloader-accessories ${accessoriesActive ? 'active' : ''}`, children: [_jsx("div", { className: "inkwell" }), _jsx("div", { className: "pen-rest" })] }), _jsxs("div", { className: `preloader-typewriter ${typewriterActive ? 'active' : ''}`, children: [_jsxs("div", { className: "typewriter-rails", children: [_jsx("div", { className: "rail" }), _jsx("div", { className: "rail" })] }), _jsx("div", { className: "typewriter-platen" }), _jsx("div", { className: `preloader-paper ${paperActive ? 'active' : ''}`, children: _jsxs("div", { className: "preloader-text-container", children: [typedChars.map((char, index) => (_jsx("span", { className: "typed-char visible", children: char }, index))), _jsx("span", { className: `typing-cursor ${isTyping ? 'typing' : ''}` })] }) }), _jsx("div", { className: "typewriter-body", children: _jsx("div", { className: "typewriter-keys-silhouette", children: [...Array(30)].map((_, i) => (_jsx("div", { className: "key-silhouette" }, i))) }) })] }), _jsx("button", { className: `preloader-skip ${skipVisible ? 'visible' : ''}`, onClick: handleSkip, "aria-label": "Skip opening sequence", children: "Skip" })] }));
}
export default LibraryPreloader;
//# sourceMappingURL=LibraryPreloader.js.map