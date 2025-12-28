'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { m } from 'framer-motion';
import { DEFAULT_ACCENT_COLOR } from '../types.js';
import { LoadingDots } from './LoadingDots.js';
import { useSkinMotion } from '../motion/hooks/useSkinMotion.js';
export function TypingIndicator({ accentColor = DEFAULT_ACCENT_COLOR }) {
    const { motion } = useSkinMotion();
    return (_jsx(m.div, { className: "rag-typing-indicator", initial: "hidden", animate: "visible", exit: "exit", variants: motion.message, children: _jsx(LoadingDots, { accentColor: accentColor, className: "rag-typing-dots", dotClassName: "rag-typing-dot" }) }));
}
//# sourceMappingURL=TypingIndicator.js.map