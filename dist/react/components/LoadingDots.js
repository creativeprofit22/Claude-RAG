'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { DEFAULT_ACCENT_COLOR } from '../types.js';
const DOT_DELAYS = [0, 150, 300];
export function LoadingDots({ accentColor = DEFAULT_ACCENT_COLOR, className = 'rag-loading-dots', dotClassName = 'rag-loading-dot', }) {
    return (_jsx("div", { className: className, children: DOT_DELAYS.map((delay) => (_jsx("div", { className: dotClassName, style: {
                backgroundColor: accentColor,
                animationDelay: `${delay}ms`,
            } }, delay))) }));
}
//# sourceMappingURL=LoadingDots.js.map