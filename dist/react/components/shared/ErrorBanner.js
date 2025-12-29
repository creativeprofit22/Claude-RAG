'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertCircle, X } from 'lucide-react';
/**
 * ErrorBanner - Dismissible error alert banner
 *
 * Uses curator-error-banner styling.
 *
 * @example
 * ```tsx
 * {error && <ErrorBanner error={error} onDismiss={() => setError(null)} />}
 * ```
 */
export function ErrorBanner({ error, onDismiss }) {
    return (_jsxs("div", { className: "curator-error-banner", role: "alert", children: [_jsx(AlertCircle, { size: 16, "aria-hidden": "true" }), _jsx("span", { children: error }), _jsx("button", { type: "button", onClick: onDismiss, className: "curator-error-dismiss", "aria-label": "Dismiss error", children: _jsx(X, { size: 14 }) })] }));
}
//# sourceMappingURL=ErrorBanner.js.map