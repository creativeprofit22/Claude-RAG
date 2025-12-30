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

import React, { useRef, useCallback } from 'react';
import { gsap } from 'gsap';

export interface IndexCardData {
  id: string;
  title: string;
  content: string;
  date?: string;
}

export interface IndexCardProps {
  card: IndexCardData;
  index: number;
  isSelected: boolean;
  onSelect: (card: IndexCardData) => void;
  onDeselect: () => void;
  stackOffset?: number;  // Vertical offset in stack
  fanAngle?: number;     // Rotation when fanning
  className?: string;
}

// Animation timing
const TIMING = {
  hover: 0.15,
  select: 0.25,
  return: 0.3,
  fan: 0.2,
};

export function IndexCard({
  card,
  index,
  isSelected,
  onSelect,
  onDeselect,
  stackOffset = 0,
  fanAngle = 0,
  className = '',
}: IndexCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  /**
   * Animate hover state - slight lift
   */
  const handleMouseEnter = useCallback(() => {
    if (!cardRef.current || !shadowRef.current || isSelected) return;

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
    if (!cardRef.current || !shadowRef.current || isSelected) return;

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
    if (!cardRef.current || !shadowRef.current) return;

    if (isSelected) {
      // Return to stack
      onDeselect();
      animateReturn();
    } else {
      // Select card
      onSelect(card);
      animateSelect();
    }
  }, [isSelected, card, onSelect, onDeselect]);

  /**
   * Select animation - lift forward
   */
  const animateSelect = useCallback(() => {
    if (!cardRef.current || !shadowRef.current) return;

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
    if (!cardRef.current || !shadowRef.current) return;

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
  const formatDate = (date: string | undefined) => {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return date;
    }
  };

  return (
    <div
      className={`index-card-wrapper ${isSelected ? 'selected' : ''} ${className}`}
      style={{
        '--stack-offset': `${stackOffset}px`,
        '--fan-angle': `${fanAngle}deg`,
        '--card-index': index,
      } as React.CSSProperties}
    >
      {/* Card Shadow */}
      <div ref={shadowRef} className="index-card-shadow" />

      {/* Main Card */}
      <div
        ref={cardRef}
        className="index-card"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `translateY(${stackOffset}px) rotateZ(${fanAngle}deg)`,
        }}
      >
        {/* Ruled Lines Background */}
        <div className="index-card-lines" />

        {/* Top Rule (Red Line) */}
        <div className="index-card-top-rule" />

        {/* Card Content */}
        <div className="index-card-content">
          {/* Title Line */}
          <div className="index-card-title">
            {card.title}
          </div>

          {/* Date (top right, typewriter style) */}
          {card.date && (
            <div className="index-card-date">
              {formatDate(card.date)}
            </div>
          )}

          {/* Content Body */}
          <div className="index-card-body">
            {card.content}
          </div>
        </div>

        {/* Card Edge Effects */}
        <div className="index-card-edge top" />
        <div className="index-card-edge bottom" />
        <div className="index-card-edge left" />
        <div className="index-card-edge right" />

        {/* Aged Paper Texture */}
        <div className="index-card-texture" />
      </div>
    </div>
  );
}

export default IndexCard;
