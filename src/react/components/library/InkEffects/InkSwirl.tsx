/**
 * InkSwirl Component
 * Library Skin V2: Typewriter Edition
 *
 * Processing state indicator showing ink swirling in an inkwell.
 * Contained, cyclical animation for ongoing operations.
 *
 * Tech stack: React + GSAP + SVG Filters
 */

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './InkEffects.css';

export interface InkSwirlProps {
  /** Whether the swirl animation is active */
  active: boolean;
  /** Size in pixels (default: 64) */
  size?: number;
  /** Additional CSS class */
  className?: string;
  /** Accessible label for screen readers */
  ariaLabel?: string;
}

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
export function InkSwirl({
  active,
  size = 64,
  className = '',
  ariaLabel = 'Processing...',
}: InkSwirlProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

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
    if (!containerRef.current) return;

    if (active) {
      gsap.fromTo(
        containerRef.current,
        {
          scale: 0.8,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: 'back.out(1.5)',
        }
      );
    }
  }, [active]);

  if (!active) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`ink-swirl ink-swirl--active ${className}`}
      style={{
        width: size,
        height: size,
      }}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      {/* Brass rim */}
      <div className="ink-swirl__rim" aria-hidden="true" />

      {/* Inkwell container */}
      <div className="ink-swirl__inkwell" aria-hidden="true">
        {/* Ink surface */}
        <div className="ink-swirl__ink">
          {/* Rotating swirl pattern */}
          <div ref={patternRef} className="ink-swirl__pattern" />

          {/* Wet sheen highlight */}
          <div className="ink-swirl__sheen" />
        </div>
      </div>
    </div>
  );
}

export default InkSwirl;
