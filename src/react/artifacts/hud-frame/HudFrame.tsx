/**
 * HudFrame Artifact Component
 * A panel container with stepped corners and targeting reticle decorations
 * Designed as a HUD-style frame, not a simple bordered rectangle
 */

import React, { memo } from 'react';
import './hud-frame.base.css';
import './hud-frame.cyberpunk.css';

export type HudFrameSize = 'compact' | 'default' | 'spacious';
export type HudFrameVariant = 'default' | 'alert' | 'warning' | 'success';

export interface HudFrameProps {
  /** Content to display inside the frame */
  children: React.ReactNode;
  /** Optional title for the header bar */
  title?: string;
  /** Optional icon element for the header */
  icon?: React.ReactNode;
  /** Size variant affecting padding */
  size?: HudFrameSize;
  /** Color variant for alert states */
  variant?: HudFrameVariant;
  /** Loading state */
  isLoading?: boolean;
  /** Hide the header bar entirely */
  hideHeader?: boolean;
  /** Hide corner reticle decorations */
  hideReticles?: boolean;
  /** Optional className for additional styling */
  className?: string;
  /** Optional aria-label for accessibility */
  'aria-label'?: string;
}

/** Reticle symbol - crosshair/targeting icon */
const RETICLE_SYMBOL = '\u2295'; // ⊕ circled plus

export const HudFrame = memo(function HudFrame({
  children,
  title,
  icon,
  size = 'default',
  variant = 'default',
  isLoading = false,
  hideHeader = false,
  hideReticles = false,
  className = '',
  'aria-label': ariaLabel,
}: HudFrameProps) {
  // Build class names
  const frameClasses = [
    'hud-frame',
    `hud-frame--${size}`,
    variant !== 'default' && `hud-frame--${variant}`,
    isLoading && 'hud-frame--loading',
    (hideHeader || !title) && 'hud-frame--no-header',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section
      className={frameClasses}
      aria-label={ariaLabel || title}
      aria-busy={isLoading}
    >
      {/* Main frame body */}
      <div className="hud-frame__body">
        {/* Edge glow effect layer */}
        <div className="hud-frame__glow" aria-hidden="true" />

        {/* Header bar (optional) */}
        {!hideHeader && title && (
          <header className="hud-frame__header">
            {icon && (
              <span className="hud-frame__title-icon">
                {icon}
              </span>
            )}
            <span className="hud-frame__title">{title}</span>
          </header>
        )}

        {/* Corner reticle decorations */}
        {!hideReticles && (
          <>
            <span className="hud-frame__reticle hud-frame__reticle--tl" aria-hidden="true">
              {RETICLE_SYMBOL}
            </span>
            <span className="hud-frame__reticle hud-frame__reticle--tr" aria-hidden="true">
              {RETICLE_SYMBOL}
            </span>
            <span className="hud-frame__reticle hud-frame__reticle--bl" aria-hidden="true">
              {RETICLE_SYMBOL}
            </span>
            <span className="hud-frame__reticle hud-frame__reticle--br" aria-hidden="true">
              {RETICLE_SYMBOL}
            </span>
          </>
        )}

        {/* Content safe zone */}
        <div className="hud-frame__content">
          {children}
        </div>

        {/* Scan line overlay */}
        <div className="hud-frame__scan" aria-hidden="true" />
      </div>
    </section>
  );
});

export default HudFrame;
