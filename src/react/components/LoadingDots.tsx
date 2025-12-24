'use client';

import { DEFAULT_ACCENT_COLOR } from '../types.js';

interface LoadingDotsProps {
  accentColor?: string;
  className?: string;
  dotClassName?: string;
}

const DOT_DELAYS = [0, 150, 300];

export function LoadingDots({
  accentColor = DEFAULT_ACCENT_COLOR,
  className = 'rag-loading-dots',
  dotClassName = 'rag-loading-dot',
}: LoadingDotsProps) {
  return (
    <div className={className}>
      {DOT_DELAYS.map((delay) => (
        <div
          key={delay}
          className={dotClassName}
          style={{
            backgroundColor: accentColor,
            animationDelay: `${delay}ms`,
          }}
        />
      ))}
    </div>
  );
}
