/**
 * Drawer Component
 * Card Catalog Drawer with GSAP physics-based animations
 *
 * Interactions:
 * - Pull Open (~300-400ms): Initial friction -> smooth glide -> soft stop
 * - Push Closed (~300ms): Initial push -> momentum slide -> impact + bounce
 */

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';

export interface DrawerProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}

// Animation timing constants (ms converted to seconds)
const TIMING = {
  // Pull Open phases
  pullFriction: 0.1,      // Initial resistance
  pullGlide: 0.2,         // Wood-on-wood slide
  pullStop: 0.05,         // Soft catch at full extension

  // Push Closed phases
  pushStart: 0.05,        // Overcomes inertia
  pushMomentum: 0.2,      // Accelerating slide
  pushImpact: 0.05,       // Satisfying thunk + bounce
};

export function Drawer({
  title,
  isOpen,
  onToggle,
  children,
  className = '',
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const pullRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  /**
   * Animate drawer opening
   * Phases: friction -> glide -> soft stop
   */
  const animateOpen = useCallback(() => {
    if (!innerRef.current || !pullRef.current) return;

    // Kill any existing animation
    timelineRef.current?.kill();
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });
    timelineRef.current = tl;

    // Phase 1: Initial friction (ease-in, slow start)
    tl.to(innerRef.current, {
      translateY: '10%',
      duration: TIMING.pullFriction,
      ease: 'power2.in',
    });

    // Phase 2: Smooth glide (wood-on-wood)
    tl.to(innerRef.current, {
      translateY: '85%',
      duration: TIMING.pullGlide,
      ease: 'power1.inOut',
    });

    // Phase 3: Soft stop (catches at full extension)
    tl.to(innerRef.current, {
      translateY: '100%',
      duration: TIMING.pullStop,
      ease: 'back.out(1.2)',
    });

    // Brass pull glint effect
    tl.to(pullRef.current, {
      '--pull-highlight': '0.4',
      duration: 0.15,
      ease: 'power2.out',
    }, 0);

    tl.to(pullRef.current, {
      '--pull-highlight': '0.15',
      duration: 0.2,
      ease: 'power2.inOut',
    }, 0.15);

    return tl;
  }, []);

  /**
   * Animate drawer closing
   * Phases: push -> momentum -> impact + bounce
   */
  const animateClose = useCallback(() => {
    if (!innerRef.current || !pullRef.current) return;

    // Kill any existing animation
    timelineRef.current?.kill();
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });
    timelineRef.current = tl;

    // Phase 1: Initial push (overcomes inertia)
    tl.to(innerRef.current, {
      translateY: '90%',
      duration: TIMING.pushStart,
      ease: 'power2.in',
    });

    // Phase 2: Momentum slide (accelerating)
    tl.to(innerRef.current, {
      translateY: '5%',
      duration: TIMING.pushMomentum,
      ease: 'power2.in',
    });

    // Phase 3: Impact + bounce (satisfying thunk)
    tl.to(innerRef.current, {
      translateY: '-2%',
      duration: TIMING.pushImpact * 0.5,
      ease: 'power3.out',
    });

    tl.to(innerRef.current, {
      translateY: '0%',
      duration: TIMING.pushImpact * 0.5,
      ease: 'power2.out',
    });

    // Add subtle shake on impact
    tl.to(drawerRef.current, {
      x: 1,
      duration: 0.02,
      ease: 'none',
    }, '-=0.05');

    tl.to(drawerRef.current, {
      x: -1,
      duration: 0.02,
      ease: 'none',
    });

    tl.to(drawerRef.current, {
      x: 0,
      duration: 0.02,
      ease: 'none',
    });

    return tl;
  }, []);

  /**
   * Handle toggle based on current state
   */
  const handleClick = useCallback(() => {
    if (isAnimating) return;
    onToggle();
  }, [isAnimating, onToggle]);

  /**
   * React to isOpen state changes
   */
  useEffect(() => {
    if (isOpen) {
      animateOpen();
    } else {
      // Only animate close if we're not in initial state
      if (innerRef.current) {
        const currentY = gsap.getProperty(innerRef.current, 'translateY');
        if (currentY && currentY !== '0%') {
          animateClose();
        }
      }
    }
  }, [isOpen, animateOpen, animateClose]);

  /**
   * Set initial state on mount
   */
  useEffect(() => {
    if (innerRef.current) {
      gsap.set(innerRef.current, {
        translateY: isOpen ? '100%' : '0%',
      });
    }
  }, []);

  return (
    <div
      ref={drawerRef}
      className={`catalog-drawer ${isOpen ? 'open' : ''} ${className}`}
      data-animating={isAnimating}
    >
      {/* Drawer Face - Always Visible */}
      <div className="drawer-face" onClick={handleClick}>
        {/* Brass Label Holder */}
        <div className="drawer-label-holder">
          <div className="drawer-label">
            <span className="drawer-label-text">{title}</span>
          </div>
        </div>

        {/* Brass Pull Handle */}
        <div ref={pullRef} className="drawer-pull">
          <div className="drawer-pull-inner" />
        </div>
      </div>

      {/* Drawer Interior - Slides Out */}
      <div ref={innerRef} className="drawer-inner">
        <div className="drawer-interior">
          {/* Drawer bottom with rails */}
          <div className="drawer-bottom">
            <div className="drawer-rail left" />
            <div className="drawer-rail right" />
          </div>

          {/* Card container */}
          <div className="drawer-cards">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Drawer;
