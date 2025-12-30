/**
 * InkWash Component
 * Library Skin V2: Typewriter Edition
 *
 * Page transition effect using ink wash wipe animation.
 * Floods in from one side, then recedes to reveal new content.
 *
 * Tech stack: React + GSAP + SVG Filters
 */

import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { gsap } from 'gsap';
import './InkEffects.css';

export interface InkWashProps {
  /** Content to wrap with transition effect */
  children: ReactNode;
  /** Whether to trigger the wash animation */
  trigger: boolean;
  /** Animation direction */
  direction?: 'in' | 'out';
  /** Callback when transition completes */
  onComplete?: () => void;
  /** Duration in milliseconds (default: 1200) */
  duration?: number;
  /** Additional CSS class */
  className?: string;
}

/**
 * InkWash - A page transition component using ink wash wipe effect.
 *
 * The animation shows:
 * 1. Ink floods in from the left with organic edge
 * 2. Covers the entire viewport momentarily
 * 3. Recedes to the right, revealing content beneath
 *
 * Use 'in' direction when entering a new page/state
 * Use 'out' direction when leaving current page/state
 *
 * @example
 * ```tsx
 * <InkWash trigger={isTransitioning} direction="in" onComplete={handleComplete}>
 *   <PageContent />
 * </InkWash>
 * ```
 */
export function InkWash({
  children,
  trigger,
  direction = 'in',
  onComplete,
  duration = 1200,
  className = '',
}: InkWashProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!trigger || !overlayRef.current || isAnimating) return;

    setIsAnimating(true);

    // Kill any existing animation
    timelineRef.current?.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        onComplete?.();
      },
    });
    timelineRef.current = tl;

    const overlay = overlayRef.current;
    const halfDuration = duration / 2000; // Convert to seconds, then halve

    if (direction === 'in') {
      // Wash in: sweep left to right, pause, then continue right
      tl.set(overlay, {
        x: '-101%',
        opacity: 1,
      });

      // Sweep in
      tl.to(overlay, {
        x: '0%',
        duration: halfDuration,
        ease: 'power2.inOut',
      });

      // Brief hold at center
      tl.to({}, { duration: 0.1 });

      // Sweep out
      tl.to(overlay, {
        x: '101%',
        duration: halfDuration,
        ease: 'power2.inOut',
      });
    } else {
      // Wash out: just sweep right
      tl.set(overlay, {
        x: '0%',
        opacity: 1,
      });

      tl.to(overlay, {
        x: '101%',
        duration: halfDuration * 2,
        ease: 'power2.inOut',
      });
    }

    // Reset position after animation
    tl.set(overlay, {
      x: '-101%',
      opacity: 0,
    });

    return () => {
      tl.kill();
    };
  }, [trigger, direction, duration, isAnimating, onComplete]);

  // Handle trigger reset
  useEffect(() => {
    if (!trigger) {
      setIsAnimating(false);
    }
  }, [trigger]);

  return (
    <div
      ref={containerRef}
      className={`ink-wash ${isAnimating ? `ink-wash--${direction}` : ''} ${className}`}
    >
      {/* Content */}
      {children}

      {/* Ink wash overlay */}
      <div
        ref={overlayRef}
        className="ink-wash__overlay"
        aria-hidden="true"
        style={{
          opacity: 0,
          transform: 'translateX(-101%)',
        }}
      >
        {/* Organic edge */}
        <div className="ink-wash__edge" />
      </div>
    </div>
  );
}

/**
 * useInkWash - Hook for controlling ink wash transitions
 *
 * @example
 * ```tsx
 * const { triggerWash, isWashing, reset } = useInkWash();
 *
 * const handleNavigate = async () => {
 *   triggerWash('in');
 *   await loadNewPage();
 *   reset();
 * };
 * ```
 */
export function useInkWash() {
  const [washState, setWashState] = useState<{
    trigger: boolean;
    direction: 'in' | 'out';
  }>({
    trigger: false,
    direction: 'in',
  });

  const triggerWash = (direction: 'in' | 'out' = 'in') => {
    setWashState({ trigger: true, direction });
  };

  const reset = () => {
    setWashState((prev) => ({ ...prev, trigger: false }));
  };

  return {
    trigger: washState.trigger,
    direction: washState.direction,
    isWashing: washState.trigger,
    triggerWash,
    reset,
  };
}

export default InkWash;
