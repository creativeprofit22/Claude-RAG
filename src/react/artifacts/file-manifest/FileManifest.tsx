/**
 * FileManifest Artifact Component
 * A corrupted thermal printer receipt with physical wear and data degradation
 *
 * Design: "Corrupted Data Terminal Printout"
 * - Tapered/angled top edge (torn from printer)
 * - Perforated tear line at bottom
 * - Feed holes on left side (dot matrix printer paper)
 * - Physical wear/aging effects
 * - Two-row entry layout: filename + time, then metadata
 */

import React, { useMemo } from 'react';
import './file-manifest.base.css';
import './file-manifest.cyberpunk.css';

export interface FileEntry {
  /** Unique document identifier */
  documentId: string;
  /** Display name of the document */
  documentName: string;
  /** Unix timestamp of upload */
  timestamp: number;
  /** Number of chunks the document was split into */
  chunkCount: number;
}

export interface FileManifestProps {
  /** Array of file entries to display */
  files: FileEntry[];
  /** Sector label displayed in header */
  sectorLabel?: string;
  /** Corruption level 0-100 affecting visual degradation */
  corruptionLevel?: number;
  /** Loading state */
  isLoading?: boolean;
  /** Optional className for additional styling */
  className?: string;
}

/**
 * Seeded random number generator (Linear Congruential Generator)
 * Provides deterministic "random" values for consistent corruption patterns
 */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

/**
 * Corrupt text by replacing random characters with block characters
 */
function corruptText(text: string, intensity: number, seed: number): string {
  if (intensity <= 0) return text;
  const rng = seededRandom(seed);
  return text
    .split('')
    .map((char) => (rng() < intensity ? '\u2588' : char))
    .join('');
}

/**
 * Generate a tapered/torn top edge clip-path for the printout
 */
function generateTornTopEdge(seed: number): string {
  const rng = seededRandom(seed);
  const points: string[] = [];

  // Tapered/torn top edge - starts slightly indented, jagged across
  points.push('2% 3%'); // Start slightly in from left, down from top

  // Create jagged tear across top
  const topSteps = 8;
  for (let i = 1; i <= topSteps; i++) {
    const x = 2 + (i / topSteps) * 96; // 2% to 98%
    const y = rng() * 4; // 0-4% variation
    points.push(`${x}% ${y}%`);
  }

  // Right side straight down
  points.push('100% 0%');
  points.push('100% 100%');

  // Bottom with perforation hint
  points.push('0% 100%');

  // Left side back up
  points.push('0% 3%');

  return `polygon(${points.join(', ')})`;
}

/**
 * Format timestamp to HH:MM format
 */
function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Truncate filename intelligently, keeping extension visible
 */
function truncateFilename(name: string, maxLen: number = 24): string {
  if (name.length <= maxLen) return name;

  const lastDot = name.lastIndexOf('.');
  if (lastDot > 0 && name.length - lastDot <= 5) {
    // Has extension, preserve it
    const ext = name.slice(lastDot);
    const baseName = name.slice(0, lastDot);
    const availableLen = maxLen - ext.length - 1; // -1 for ellipsis
    return baseName.slice(0, availableLen) + '\u2026' + ext;
  }

  return name.slice(0, maxLen - 1) + '\u2026';
}

export function FileManifest({
  files,
  sectorLabel = 'SECTOR 7G',
  corruptionLevel = 0,
  isLoading = false,
  className = '',
}: FileManifestProps) {
  const corruptionIntensity = Math.min(100, Math.max(0, corruptionLevel)) / 100;

  // Generate torn top edge
  const tornEdge = useMemo(() => generateTornTopEdge(42), []);

  // Determine which entries are corrupted (compute intensity inside to avoid stale closure)
  const corruptedIndices = useMemo(() => {
    if (corruptionLevel <= 0) return new Set<number>();
    const intensity = Math.min(100, Math.max(0, corruptionLevel)) / 100;
    const rng = seededRandom(corruptionLevel);
    const indices = new Set<number>();
    files.forEach((_, index) => {
      if (rng() < intensity * 0.8) {
        indices.add(index);
      }
    });
    return indices;
  }, [files, corruptionLevel]);

  // Generate feed hole positions (left edge sprocket holes)
  const feedHoles = useMemo(() => {
    const count = Math.max(4, Math.min(12, files.length * 2 + 4));
    return Array.from({ length: count }, (_, i) => i);
  }, [files.length]);

  return (
    <article
      className={`file-manifest file-manifest--printout ${isLoading ? 'file-manifest--loading' : ''} ${className}`}
      aria-label="File Manifest"
      aria-busy={isLoading}
    >
      {/* Physical printout wrapper */}
      <div
        className="file-manifest__printout"
        style={{ '--torn-edge': tornEdge } as React.CSSProperties}
      >
        {/* Feed holes (sprocket holes on left edge) */}
        <div className="file-manifest__feed-holes" aria-hidden="true">
          {feedHoles.map((i) => (
            <div
              key={i}
              className="file-manifest__feed-hole"
              style={{ '--hole-index': i } as React.CSSProperties}
            />
          ))}
        </div>

        {/* Main content area */}
        <div className="file-manifest__paper">
          {/* Header - thermal print style */}
          <header className="file-manifest__header">
            <div className="file-manifest__header-row">
              <span className="file-manifest__title">
                {corruptText('FILE_MANIFEST', corruptionIntensity * 0.2, 11)}
              </span>
              <span className="file-manifest__sector" aria-label="Sector">
                {corruptText(sectorLabel, corruptionIntensity * 0.3, 42)}
              </span>
            </div>
            <div className="file-manifest__header-divider" aria-hidden="true">
              {corruptText('================================', corruptionIntensity * 0.15, 99)}
            </div>
            <div className="file-manifest__integrity">
              DATA INTEGRITY: {Math.max(0, 100 - corruptionLevel)}%
            </div>
          </header>

          {/* File entries - two-row layout */}
          <div className="file-manifest__entries" role="list">
            {files.map((file, index) => {
              const isCorrupted = corruptedIndices.has(index);
              const entryIntensity = isCorrupted ? corruptionIntensity : 0;
              const entrySeed = index * 777 + file.timestamp;
              const displayName = truncateFilename(file.documentName);
              const timeStr = formatTime(file.timestamp);
              const chunkStr = `${file.chunkCount} chunks`;

              return (
                <div
                  key={file.documentId}
                  className={`file-manifest__entry ${isCorrupted ? 'file-manifest__entry--corrupted' : ''}`}
                  role="listitem"
                  style={{ '--entry-delay': `${index * 0.05}s` } as React.CSSProperties}
                >
                  {/* Row 1: Status indicator, filename, time */}
                  <div className="file-manifest__entry-row file-manifest__entry-row--primary">
                    <span
                      className={`file-manifest__entry-status ${isCorrupted ? 'file-manifest__entry-status--error' : ''}`}
                      aria-label={isCorrupted ? 'Corrupted' : 'Healthy'}
                    >
                      {isCorrupted ? '\u2588' : '\u25CF'}
                    </span>
                    <span
                      className="file-manifest__entry-name"
                      title={file.documentName}
                    >
                      {corruptText(displayName, entryIntensity * 0.5, entrySeed)}
                    </span>
                    <span className="file-manifest__entry-time">
                      {corruptText(timeStr, entryIntensity * 0.6, entrySeed + 1)}
                    </span>
                  </div>

                  {/* Row 2: Metadata (indented) */}
                  <div className="file-manifest__entry-row file-manifest__entry-row--secondary">
                    <span className="file-manifest__entry-indent" aria-hidden="true">
                      {'\u2514\u2500'}
                    </span>
                    <span className="file-manifest__entry-meta">
                      {isCorrupted && entryIntensity > 0.5
                        ? <span className="file-manifest__error-text">ERR</span>
                        : corruptText(chunkStr, entryIntensity * 0.4, entrySeed + 2)
                      }
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Empty state */}
            {files.length === 0 && !isLoading && (
              <div className="file-manifest__empty">
                <span className="file-manifest__empty-icon">[!]</span>
                <span>NO FILES IN MANIFEST</span>
              </div>
            )}

            {/* Loading skeleton */}
            {isLoading && files.length === 0 && (
              <>
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="file-manifest__entry file-manifest__entry--skeleton">
                    <div className="file-manifest__entry-row file-manifest__entry-row--primary">
                      <span className="file-manifest__entry-status">{'\u25CB'}</span>
                      <span className="file-manifest__entry-name">SCANNING...</span>
                      <span className="file-manifest__entry-time">--:--</span>
                    </div>
                    <div className="file-manifest__entry-row file-manifest__entry-row--secondary">
                      <span className="file-manifest__entry-indent">{'\u2514\u2500'}</span>
                      <span className="file-manifest__entry-meta">- chunks</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer separator */}
          <div className="file-manifest__footer-divider" aria-hidden="true">
            {corruptText('--------------------------------', corruptionIntensity * 0.2, 88)}
          </div>

          {/* Footer stats */}
          <footer className="file-manifest__footer">
            <div className="file-manifest__stats">
              <span className="file-manifest__stat">
                TOTAL: {files.length}
              </span>
              <span className="file-manifest__stat file-manifest__stat--warn">
                {corruptedIndices.size > 0 && `ERR: ${corruptedIndices.size}`}
              </span>
            </div>

            {/* Corruption bar */}
            {corruptionLevel > 0 && (
              <div
                className="file-manifest__corruption-bar"
                role="meter"
                aria-valuenow={corruptionLevel}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Data corruption level"
              >
                <div
                  className="file-manifest__corruption-fill"
                  style={{ '--corruption-percent': `${corruptionLevel}%` } as React.CSSProperties}
                />
              </div>
            )}
          </footer>
        </div>

        {/* Perforated tear line at bottom */}
        <div className="file-manifest__perforation" aria-hidden="true">
          <div className="file-manifest__perforation-line" />
        </div>

        {/* Scanlines overlay */}
        <div className="file-manifest__scanlines" aria-hidden="true" />

        {/* Glitch overlay for high corruption */}
        {corruptionLevel > 50 && (
          <div className="file-manifest__glitch" aria-hidden="true" />
        )}
      </div>
    </article>
  );
}

export default FileManifest;
