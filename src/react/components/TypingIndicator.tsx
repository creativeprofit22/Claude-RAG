'use client';

import { DEFAULT_ACCENT_COLOR } from '../types.js';
import { LoadingDots } from './LoadingDots.js';

interface TypingIndicatorProps {
  accentColor?: string;
}

export function TypingIndicator({ accentColor = DEFAULT_ACCENT_COLOR }: TypingIndicatorProps) {
  return (
    <div className="rag-typing-indicator">
      <LoadingDots
        accentColor={accentColor}
        className="rag-typing-dots"
        dotClassName="rag-typing-dot"
      />
    </div>
  );
}
