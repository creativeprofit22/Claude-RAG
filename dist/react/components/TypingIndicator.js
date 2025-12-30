'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { DEFAULT_ACCENT_COLOR } from '../types.js';
import { LoadingDots } from './LoadingDots.js';
import { useSkinDetect } from '../motion/hooks/useSkinDetect.js';
/**
 * TypingIndicator - Shows loading state in the chat
 *
 * For library skin: Uses library accent color
 * For other skins: Uses original LoadingDots animation
 */
export function TypingIndicator({ accentColor = DEFAULT_ACCENT_COLOR, }) {
    const skin = useSkinDetect();
    // Simplified - no Framer Motion animations to avoid conflicts
    if (skin === 'library') {
        return (_jsx("div", { className: "rag-typing-indicator rag-typing-indicator--library", children: _jsx(LoadingDots, { accentColor: "var(--lib-accent, #8B4513)", className: "rag-typing-dots", dotClassName: "rag-typing-dot" }) }));
    }
    return (_jsx("div", { className: "rag-typing-indicator", children: _jsx(LoadingDots, { accentColor: accentColor, className: "rag-typing-dots", dotClassName: "rag-typing-dot" }) }));
}
//# sourceMappingURL=TypingIndicator.js.map