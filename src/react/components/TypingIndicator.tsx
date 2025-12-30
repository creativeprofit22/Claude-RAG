'use client';

import { DEFAULT_ACCENT_COLOR } from '../types.js';
import { LoadingDots } from './LoadingDots.js';
import { useSkinDetect } from '../motion/hooks/useSkinDetect.js';

interface TypingIndicatorProps {
  accentColor?: string;
}

/**
 * TypingIndicator - Shows loading state in the chat
 *
 * For library skin: Uses library accent color
 * For other skins: Uses original LoadingDots animation
 */
export function TypingIndicator({
  accentColor = DEFAULT_ACCENT_COLOR,
}: TypingIndicatorProps) {
  const skin = useSkinDetect();

  // Simplified - no Framer Motion animations to avoid conflicts
  if (skin === 'library') {
    return (
      <div className="rag-typing-indicator rag-typing-indicator--library">
        <LoadingDots
          accentColor="var(--lib-accent, #8B4513)"
          className="rag-typing-dots"
          dotClassName="rag-typing-dot"
        />
      </div>
    );
  }

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
