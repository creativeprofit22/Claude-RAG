'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { m } from 'framer-motion';
import { DEFAULT_ACCENT_COLOR } from '../types.js';
import { LoadingDots } from './LoadingDots.js';
import { useSkinMotion } from '../motion/hooks/useSkinMotion.js';
import { useSkinDetect } from '../motion/hooks/useSkinDetect.js';
import { InkDrop } from './library/InkEffects/InkDrop.js';
/**
 * TypingIndicator - Shows loading state in the chat
 *
 * For library skin: Uses InkDrop (ink dropping from pen nib)
 * For other skins: Uses original LoadingDots animation
 */
export function TypingIndicator({ accentColor = DEFAULT_ACCENT_COLOR, isProcessing = false, }) {
    const { motion } = useSkinMotion();
    const skin = useSkinDetect();
    // Library skin: Use InkDrop effect
    if (skin === 'library') {
        return (_jsx(m.div, { className: "rag-typing-indicator rag-typing-indicator--library", initial: "hidden", animate: "visible", exit: "exit", variants: motion.message, children: _jsx(InkDrop, { active: true, size: "md", ariaLabel: isProcessing ? 'Processing...' : 'Assistant is typing...' }) }));
    }
    // Default skin: Use LoadingDots
    return (_jsx(m.div, { className: "rag-typing-indicator", initial: "hidden", animate: "visible", exit: "exit", variants: motion.message, children: _jsx(LoadingDots, { accentColor: accentColor, className: "rag-typing-dots", dotClassName: "rag-typing-dot" }) }));
}
//# sourceMappingURL=TypingIndicator.js.map