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
 * For library skin: Uses InkDrop (ink bottle animation)
 * For other skins: Uses original LoadingDots animation
 */
export function TypingIndicator({
  accentColor = DEFAULT_ACCENT_COLOR,
}: TypingIndicatorProps) {
  const skin = useSkinDetect();

  // Library skin: No separate typing indicator - the message bubble's InkDrop handles it
  if (skin === 'library') {
    return null;
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
