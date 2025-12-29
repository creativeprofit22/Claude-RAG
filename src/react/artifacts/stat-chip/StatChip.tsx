/**
 * StatChip Artifact Component
 * A holographic data chip that displays statistics
 * Designed as a physical object, not a styled rectangle
 */

import React from 'react';
import './stat-chip.base.css';
import './stat-chip.cyberpunk.css';

export interface StatChipProps {
  /** Icon element to display */
  icon: React.ReactNode;
  /** The stat value to display */
  value: string | number;
  /** Label describing the stat */
  label: string;
  /** Optional metadata/subtitle */
  meta?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Optional className for additional styling */
  className?: string;
}

export function StatChip({
  icon,
  value,
  label,
  meta,
  isLoading = false,
  className = '',
}: StatChipProps) {
  const displayValue = isLoading ? '---' : String(value);

  return (
    <article
      className={`stat-chip ${isLoading ? 'stat-chip--loading' : ''} ${className}`}
      aria-label={label}
      aria-busy={isLoading}
    >
      {/* Shadow projection on surface below */}
      <div className="stat-chip__shadow" aria-hidden="true" />

      {/* Main chip body */}
      <div className="stat-chip__body">
        {/* Circuitry pattern layer */}
        <div className="stat-chip__circuits" aria-hidden="true" />

        {/* Holographic projection zone - the data display */}
        <div className="stat-chip__holo">
          <span
            className="stat-chip__value"
            data-text={displayValue}
          >
            {displayValue}
          </span>
          <span className="stat-chip__label">{label}</span>
          {meta && <span className="stat-chip__meta">{meta}</span>}
        </div>

        {/* Wear and damage overlay */}
        <div className="stat-chip__wear" aria-hidden="true" />

        {/* Icon badge in corner */}
        <div className="stat-chip__icon">
          {icon}
        </div>
      </div>

      {/* Connector pins at bottom */}
      <div className="stat-chip__pins" aria-hidden="true">
        <span className="stat-chip__pin" />
        <span className="stat-chip__pin" />
        <span className="stat-chip__pin" />
        <span className="stat-chip__pin" />
        <span className="stat-chip__pin" />
      </div>
    </article>
  );
}

export default StatChip;
