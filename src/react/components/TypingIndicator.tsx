'use client';

import { m } from 'framer-motion';
import { DEFAULT_ACCENT_COLOR } from '../types.js';
import { LoadingDots } from './LoadingDots.js';
import { useSkinMotion } from '../motion/hooks/useSkinMotion.js';
import { useSkinDetect } from '../motion/hooks/useSkinDetect.js';
import { InkDrop } from './library/InkEffects/InkDrop.js';

interface TypingIndicatorProps {
  accentColor?: string;
  /** Optional: force processing state (uses InkSwirl instead of InkDrop) */
  isProcessing?: boolean;
}

/**
 * TypingIndicator - Shows loading state in the chat
 *
 * For library skin: Uses InkDrop (ink dropping from pen nib)
 * For other skins: Uses original LoadingDots animation
 */
export function TypingIndicator({
  accentColor = DEFAULT_ACCENT_COLOR,
  isProcessing = false,
}: TypingIndicatorProps) {
  const { motion } = useSkinMotion();
  const skin = useSkinDetect();

  // Library skin: Use InkDrop effect
  if (skin === 'library') {
    return (
      <m.div
        className="rag-typing-indicator rag-typing-indicator--library"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={motion.message}
      >
        <InkDrop
          active={true}
          size="md"
          ariaLabel={isProcessing ? 'Processing...' : 'Assistant is typing...'}
        />
      </m.div>
    );
  }

  // Default skin: Use LoadingDots
  return (
    <m.div
      className="rag-typing-indicator"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={motion.message}
    >
      <LoadingDots
        accentColor={accentColor}
        className="rag-typing-dots"
        dotClassName="rag-typing-dot"
      />
    </m.div>
  );
}
