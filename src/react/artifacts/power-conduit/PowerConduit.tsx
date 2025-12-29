/**
 * PowerConduit Artifact Component
 * A cyberpunk energy conduit progress bar with segmented power cells
 * Designed as a physical power gauge, not a styled rectangle
 */

import React from 'react';
import './power-conduit.base.css';
import './power-conduit.cyberpunk.css';

export interface PowerConduitProps {
  /** Current value */
  value: number;
  /** Maximum value */
  max: number;
  /** Label describing the metric */
  label: string;
  /** Visual variant */
  variant?: 'default' | 'warning' | 'critical';
  /** Number of segments (power cells) */
  segments?: number;
  /** Optional className for additional styling */
  className?: string;
}

export function PowerConduit({
  value,
  max,
  label,
  variant = 'default',
  segments = 10,
  className = '',
}: PowerConduitProps) {
  // Calculate fill percentage (guard against division by zero)
  const percentage = max > 0
    ? Math.min(100, Math.max(0, (value / max) * 100))
    : 0;
  const filledSegments = Math.round((percentage / 100) * segments);
  const isFull = percentage === 100;

  // Generate segment elements
  const segmentElements = Array.from({ length: segments }, (_, i) => {
    const isFilled = i < filledSegments;
    const isLast = i === filledSegments - 1 && filledSegments > 0;

    return (
      <div
        key={i}
        className={`power-conduit__segment ${isFilled ? 'power-conduit__segment--filled' : ''} ${isLast ? 'power-conduit__segment--active' : ''}`}
        aria-hidden="true"
      />
    );
  });

  return (
    <div
      className={`power-conduit power-conduit--${variant}${isFull ? ' power-conduit--full' : ''} ${className}`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
    >
      {/* Shadow projection on surface below */}
      <div className="power-conduit__shadow" aria-hidden="true" />

      {/* Main conduit body */}
      <div className="power-conduit__body">
        {/* Circuitry pattern layer */}
        <div className="power-conduit__circuits" aria-hidden="true" />

        {/* Segment container */}
        <div className="power-conduit__track">
          {segmentElements}
        </div>

        {/* Energy flow effect overlay */}
        <div className="power-conduit__flow" aria-hidden="true" />

        {/* Wear and damage overlay */}
        <div className="power-conduit__wear" aria-hidden="true" />
      </div>

      {/* Label and value display */}
      <div className="power-conduit__info">
        <span className="power-conduit__label">{label}</span>
        <span className="power-conduit__value" data-text={`${Math.round(percentage)}%`}>
          {Math.round(percentage)}%
        </span>
      </div>

      {/* Frame end caps */}
      <div className="power-conduit__cap power-conduit__cap--left" aria-hidden="true" />
      <div className="power-conduit__cap power-conduit__cap--right" aria-hidden="true" />
    </div>
  );
}

export default PowerConduit;
