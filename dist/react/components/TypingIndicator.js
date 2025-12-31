'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { DEFAULT_ACCENT_COLOR } from '../types.js';
import { LoadingDots } from './LoadingDots.js';
import { useSkinDetect } from '../motion/hooks/useSkinDetect.js';
/**
 * TypingIndicator - Shows loading state in the chat
 *
 * For library skin: Uses InkDrop (ink bottle animation)
 * For other skins: Uses original LoadingDots animation
 */
export function TypingIndicator({ accentColor = DEFAULT_ACCENT_COLOR, }) {
    const skin = useSkinDetect();
    // Library skin: No separate typing indicator - the message bubble's InkDrop handles it
    if (skin === 'library') {
        return null;
    }
    return (_jsx("div", { className: "rag-typing-indicator", children: _jsx(LoadingDots, { accentColor: accentColor, className: "rag-typing-dots", dotClassName: "rag-typing-dot" }) }));
}
//# sourceMappingURL=TypingIndicator.js.map