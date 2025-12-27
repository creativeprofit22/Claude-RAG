'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FileText } from 'lucide-react';
/**
 * EmptyState - Reusable empty state component with icon, title, and description
 */
export function EmptyState({ icon: Icon = FileText, iconSize = 48, iconColor, iconShadow, title, description, className = '', }) {
    const iconStyle = {
        ...(iconColor && { color: iconColor }),
        ...(iconShadow && { boxShadow: iconShadow }),
    };
    return (_jsxs("div", { className: `curator-empty-state ${className}`, children: [_jsx("div", { className: "curator-empty-state-icon", style: iconShadow ? { boxShadow: iconShadow } : undefined, children: _jsx(Icon, { size: iconSize, style: iconColor ? { color: iconColor } : undefined, "aria-hidden": "true" }) }), _jsx("h3", { className: "curator-empty-state-title", children: title }), _jsx("p", { className: "curator-empty-state-description", children: description })] }));
}
//# sourceMappingURL=EmptyState.js.map