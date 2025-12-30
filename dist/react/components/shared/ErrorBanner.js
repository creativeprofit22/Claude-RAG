'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertCircle, X } from 'lucide-react';
import { useSkinDetect } from '../../motion/hooks/useSkinDetect.js';
import { InkBlot } from '../library/InkEffects/InkBlot.js';
/**
 * ErrorBanner - Dismissible error alert banner
 *
 * For library skin: Uses InkBlot with ink spreading animation
 * For other skins: Uses curator-error-banner styling
 *
 * @example
 * ```tsx
 * {error && <ErrorBanner error={error} onDismiss={() => setError(null)} />}
 * ```
 */
export function ErrorBanner({ error, onDismiss }) {
    const skin = useSkinDetect();
    // Library skin: Use InkBlot error display
    if (skin === 'library') {
        return (_jsx("div", { className: "rag-error-banner rag-error-banner--library", children: _jsx(InkBlot, { message: error, onDismiss: onDismiss, showDismiss: true, autoDismissAfter: 0 }) }));
    }
    // Default skin: Use standard error banner
    return (_jsxs("div", { className: "curator-error-banner", role: "alert", children: [_jsx(AlertCircle, { size: 16, "aria-hidden": "true" }), _jsx("span", { children: error }), _jsx("button", { type: "button", onClick: onDismiss, className: "curator-error-dismiss", "aria-label": "Dismiss error", children: _jsx(X, { size: 14 }) })] }));
}
//# sourceMappingURL=ErrorBanner.js.map