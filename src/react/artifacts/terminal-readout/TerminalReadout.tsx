/**
 * TerminalReadout Artifact Component
 * A busted CRT terminal with phosphor decay and burn-in effects
 * Displays service health status in a retro terminal aesthetic
 */

import React from 'react';
import './terminal-readout.base.css';
import './terminal-readout.cyberpunk.css';
import './terminal-readout.library.css';

export type ServiceStatus = 'up' | 'degraded' | 'down' | 'unknown';

export interface ServiceEntry {
  /** Icon element to display */
  icon: React.ReactNode;
  /** Service name label */
  label: string;
  /** Current status */
  status: ServiceStatus;
  /** Optional status text override (defaults to status value) */
  statusText?: string;
  /** Optional metadata */
  meta?: string;
}

export interface TerminalReadoutProps {
  /** Terminal title (e.g., "SYSTEM_HEALTH.exe") */
  title?: string;
  /** Array of service entries to display */
  services: ServiceEntry[];
  /** Burn-in ghost text (always visible at low opacity) */
  burnInText?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Optional className for additional styling */
  className?: string;
}

/** Calculate bar fill based on status */
function getStatusBarFill(status: ServiceStatus): number {
  switch (status) {
    case 'up': return 100;
    case 'degraded': return 50;
    case 'down': return 0;
    default: return 25;
  }
}

/** Get display text for status */
function getStatusText(status: ServiceStatus, override?: string): string {
  if (override) return override;
  switch (status) {
    case 'up': return 'UP';
    case 'degraded': return 'SLOW';
    case 'down': return 'DOWN';
    default: return '???';
  }
}

export function TerminalReadout({
  title = 'SYSTEM_HEALTH.exe',
  services,
  burnInText = 'SYSTEM INITIALIZED',
  isLoading = false,
  className = '',
}: TerminalReadoutProps) {
  return (
    <article
      className={`terminal-readout ${isLoading ? 'terminal-readout--loading' : ''} ${className}`}
      aria-label="System Health Terminal"
      aria-busy={isLoading}
    >
      {/* CRT Frame */}
      <div className="terminal-readout__frame">
        {/* Title bar */}
        <header className="terminal-readout__titlebar">
          <span className="terminal-readout__title-icon" aria-hidden="true">&#9617;&#9618;</span>
          <span className="terminal-readout__title">{title}</span>
        </header>

        {/* Screen area */}
        <div className="terminal-readout__screen">
          {/* Service entries */}
          <div className="terminal-readout__services">
            {services.map((service, index) => (
              <div
                key={service.label}
                className={`terminal-readout__service terminal-readout__service--${service.status}`}
                style={{ '--flicker-delay': `${index * 0.15}s` } as React.CSSProperties}
              >
                <div className="terminal-readout__service-icon">
                  {service.icon}
                </div>
                <span className="terminal-readout__service-label">
                  {service.label}
                </span>
                <div
                  className="terminal-readout__status-bar"
                  role="meter"
                  aria-valuenow={getStatusBarFill(service.status)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${service.label} health`}
                >
                  <div
                    className="terminal-readout__status-fill"
                    style={{ '--fill-percent': `${getStatusBarFill(service.status)}%` } as React.CSSProperties}
                  />
                </div>
                <span className="terminal-readout__status-text">
                  {getStatusText(service.status, service.statusText)}
                </span>
              </div>
            ))}

            {/* Empty state */}
            {services.length === 0 && !isLoading && (
              <div className="terminal-readout__empty">
                NO SERVICES DETECTED
              </div>
            )}

            {/* Loading skeleton */}
            {isLoading && services.length === 0 && (
              <>
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="terminal-readout__service terminal-readout__service--skeleton">
                    <div className="terminal-readout__service-icon">&#9633;</div>
                    <span className="terminal-readout__service-label">SCANNING...</span>
                    <div className="terminal-readout__status-bar">
                      <div className="terminal-readout__status-fill" />
                    </div>
                    <span className="terminal-readout__status-text">---</span>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Burn-in ghost text - always visible at low opacity */}
          <div className="terminal-readout__burnin" aria-hidden="true">
            {burnInText}
          </div>

          {/* Scanline overlay */}
          <div className="terminal-readout__scanlines" aria-hidden="true" />

          {/* Screen reflection/glare */}
          <div className="terminal-readout__glare" aria-hidden="true" />
        </div>

        {/* CRT bezel label */}
        <footer className="terminal-readout__bezel">
          <span className="terminal-readout__bezel-label">CRT_FRAME</span>
        </footer>
      </div>
    </article>
  );
}

export default TerminalReadout;
