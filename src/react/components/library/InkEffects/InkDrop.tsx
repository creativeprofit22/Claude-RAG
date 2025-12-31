/**
 * InkDrop Component
 * Library Skin V2: Typewriter Edition
 *
 * Loading state indicator that simulates ink dropping from an inkwell
 * and spreading organically on paper.
 *
 * Tech stack: React + GSAP + SVG Filters
 */

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './InkEffects.css';

export interface InkDropProps {
  /** Whether the loading animation is active */
  active: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS class */
  className?: string;
  /** Accessible label for screen readers */
  ariaLabel?: string;
}

/**
 * InkDrop - A loading indicator styled as ink dropping from an inkwell.
 *
 * The animation shows:
 * 1. Ink forming at the inkwell opening
 * 2. Drop falling organically
 * 3. Spreading into a puddle on impact
 * 4. Puddle fading as ink absorbs into paper
 *
 * @example
 * ```tsx
 * <InkDrop active={isLoading} size="md" />
 * ```
 */
export function InkDrop({
  active,
  size = 'md',
  className = '',
  ariaLabel = 'Loading...',
}: InkDropProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const puddleRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!active || !dropRef.current || !puddleRef.current) {
      // Kill animation when inactive
      timelineRef.current?.kill();
      timelineRef.current = null;
      return;
    }

    // Create main timeline for enhanced GSAP control
    const tl = gsap.timeline({ repeat: -1 });
    timelineRef.current = tl;

    const dropSize = size === 'sm' ? 24 : size === 'md' ? 40 : 64;
    const dropElement = dropRef.current;
    const puddleElement = puddleRef.current;

    // Phase 1: Drop forms at nib
    tl.fromTo(
      dropElement,
      {
        y: 0,
        scale: 0.5,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      }
    );

    // Phase 2: Drop grows slightly (surface tension)
    tl.to(dropElement, {
      scale: 1.15,
      duration: 0.2,
      ease: 'power1.inOut',
    });

    // Phase 3: Drop falls
    tl.to(dropElement, {
      y: dropSize * 1.2,
      scale: 0.85,
      duration: 0.25,
      ease: 'power2.in',
    });

    // Phase 4: Drop impacts and disappears
    tl.to(dropElement, {
      scale: 0,
      opacity: 0,
      duration: 0.1,
      ease: 'power3.in',
    });

    // Phase 5: Puddle appears and spreads (organic blob)
    tl.fromTo(
      puddleElement,
      {
        width: 0,
        height: 0,
        opacity: 0,
      },
      {
        width: dropSize * 0.3,
        height: dropSize * 0.15,
        opacity: 1,
        duration: 0.15,
        ease: 'power2.out',
      },
      '-=0.05'
    );

    // Phase 6: Puddle continues spreading with morphing shape
    tl.to(puddleElement, {
      width: dropSize * 0.85,
      height: dropSize * 0.3,
      borderRadius: '48% 52% 45% 55% / 55% 45% 52% 48%',
      duration: 0.4,
      ease: 'power2.out',
    });

    // Phase 7: Puddle absorbs into paper (fades)
    tl.to(puddleElement, {
      opacity: 0,
      scale: 1.1,
      duration: 0.5,
      ease: 'power1.in',
    });

    // Pause before next cycle
    tl.to({}, { duration: 0.3 });

    return () => {
      tl.kill();
    };
  }, [active, size]);

  if (!active) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`ink-drop ink-drop--${size} ${className}`}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      {/* Inkwell */}
      <div className="ink-drop__nib" aria-hidden="true" />

      {/* Falling drop */}
      <div ref={dropRef} className="ink-drop__drop" aria-hidden="true" />

      {/* Surface where drop lands */}
      <div className="ink-drop__surface" aria-hidden="true">
        {/* Spreading puddle */}
        <div ref={puddleRef} className="ink-drop__puddle" />
      </div>
    </div>
  );
}

export default InkDrop;
