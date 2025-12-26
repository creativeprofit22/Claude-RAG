'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { DEFAULT_ACCENT_COLOR } from '../types.js';
import { LoadingDots } from './LoadingDots.js';
export function TypingIndicator({ accentColor = DEFAULT_ACCENT_COLOR }) {
    return (_jsx("div", { className: "rag-typing-indicator", children: _jsx(LoadingDots, { accentColor: accentColor, className: "rag-typing-dots", dotClassName: "rag-typing-dot" }) }));
}
//# sourceMappingURL=TypingIndicator.js.map