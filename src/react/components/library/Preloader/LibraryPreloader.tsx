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

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { useTypewriterSound } from '../TypewriterInput/useTypewriterSound.js';
import { usePreloaderState } from './usePreloaderState.js';
import type { LibraryPreloaderProps, PreloaderFrame } from './preloader.types.js';
import { PRELOADER_TIMING } from './preloader.types.js';
import './LibraryPreloader.css';

const DEFAULT_WELCOME_TEXT = 'Welcome to the Library...';

export function LibraryPreloader({
  onComplete,
  welcomeText = DEFAULT_WELCOME_TEXT,
  soundEnabled = true,
  forceShow = false,
  className = '',
}: LibraryPreloaderProps) {
  // State management
  const {
    shouldShow,
    prefersReducedMotion,
    markAsSeen,
    skipToEnd,
    wasSkipped,
  } = usePreloaderState({ forceShow });

  // Animation state
  const [currentFrame, setCurrentFrame] = useState<PreloaderFrame>('black');
  const [skipVisible, setSkipVisible] = useState(false);
  const [typedChars, setTypedChars] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const skipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasStartedRef = useRef(false);

  // Sound hook
  const { playSound, initAudio } = useTypewriterSound({
    enabled: soundEnabled,
    volume: 0.25,
  });

  /**
   * Type characters one by one
   */
  const typeCharacters = useCallback(
    (text: string, onTypingComplete: () => void) => {
      setIsTyping(true);
      const chars = text.split('');
      let index = 0;

      const typeNext = () => {
        if (index < chars.length) {
          setTypedChars((prev) => [...prev, chars[index]]);

          // Play keystroke sound for each character
          if (chars[index] !== ' ') {
            playSound('keystroke');
          } else {
            playSound('space');
          }

          index++;
          setTimeout(typeNext, PRELOADER_TIMING.characterDelay);
        } else {
          setIsTyping(false);
          onTypingComplete();
        }
      };

      typeNext();
    },
    [playSound]
  );

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
    if (hasStartedRef.current) return;
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
    tl.call(
      () => {
        setCurrentFrame('glow');
      },
      [],
      PRELOADER_TIMING.frame2.start / 1000
    );

    // Frame 3: Desk and typewriter materialize (1000ms)
    tl.call(
      () => {
        setCurrentFrame('desk');
      },
      [],
      PRELOADER_TIMING.frame3.start / 1000
    );

    // Frame 4: Paper rolls in (1500ms)
    tl.call(
      () => {
        setCurrentFrame('paper');
      },
      [],
      PRELOADER_TIMING.frame4.start / 1000
    );

    // Frame 5: Typing animation (2000ms)
    tl.call(
      () => {
        setCurrentFrame('typing');
        typeCharacters(welcomeText, () => {
          // Typing complete, move to frame 6
          setCurrentFrame('complete');
        });
      },
      [],
      PRELOADER_TIMING.frame5.start / 1000
    );

    // Frame 6: Completion (2500ms + typing time)
    const typingDuration =
      welcomeText.length * PRELOADER_TIMING.characterDelay;
    tl.call(
      () => {
        completeSequence();
      },
      [],
      (PRELOADER_TIMING.frame6.start + typingDuration) / 1000
    );
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

  return (
    <div
      ref={containerRef}
      className={`library-preloader ${isCompleting ? 'completing' : ''} ${
        prefersReducedMotion ? 'reduced-motion' : ''
      } ${className}`}
      role="presentation"
      aria-label="Library opening sequence"
    >
      {/* Lamp chain pull */}
      <div className={`preloader-lamp-chain ${currentFrame !== 'black' ? 'active' : ''}`}>
        <div className="preloader-lamp-pull" />
      </div>

      {/* Amber glow */}
      <div className={`preloader-glow ${glowActive ? 'active' : ''}`} />

      {/* Desk surface */}
      <div className={`preloader-desk ${deskActive ? 'active' : ''}`} />

      {/* Accessories (inkwell, pen rest) */}
      <div className={`preloader-accessories ${accessoriesActive ? 'active' : ''}`}>
        <div className="inkwell" />
        <div className="pen-rest" />
      </div>

      {/* Typewriter */}
      <div className={`preloader-typewriter ${typewriterActive ? 'active' : ''}`}>
        {/* Rails */}
        <div className="typewriter-rails">
          <div className="rail" />
          <div className="rail" />
        </div>

        {/* Platen */}
        <div className="typewriter-platen" />

        {/* Paper with text */}
        <div className={`preloader-paper ${paperActive ? 'active' : ''}`}>
          <div className="preloader-text-container">
            {typedChars.map((char, index) => (
              <span key={index} className="typed-char visible">
                {char}
              </span>
            ))}
            <span className={`typing-cursor ${isTyping ? 'typing' : ''}`} />
          </div>
        </div>

        {/* Body */}
        <div className="typewriter-body">
          <div className="typewriter-keys-silhouette">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="key-silhouette" />
            ))}
          </div>
        </div>
      </div>

      {/* Skip button */}
      <button
        className={`preloader-skip ${skipVisible ? 'visible' : ''}`}
        onClick={handleSkip}
        aria-label="Skip opening sequence"
      >
        Skip
      </button>
    </div>
  );
}

export default LibraryPreloader;
