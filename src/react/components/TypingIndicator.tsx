'use client';

import { m } from 'framer-motion';
import { DEFAULT_ACCENT_COLOR } from '../types.js';
import { LoadingDots } from './LoadingDots.js';
import { useSkinMotion } from '../motion/hooks/useSkinMotion.js';

interface TypingIndicatorProps {
  accentColor?: string;
}

export function TypingIndicator({ accentColor = DEFAULT_ACCENT_COLOR }: TypingIndicatorProps) {
  const { motion } = useSkinMotion();

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
