import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './power-conduit.base.css';
import './power-conduit.cyberpunk.css';
export function PowerConduit({ value, max, label, variant = 'default', segments = 10, className = '', }) {
    // Calculate fill percentage (guard against division by zero)
    const percentage = max > 0
        ? Math.min(100, Math.max(0, (value / max) * 100))
        : 0;
    const roundedPct = Math.round(percentage);
    const filledSegments = Math.round((percentage / 100) * segments);
    const isFull = percentage === 100;
    // Generate segment elements
    const segmentElements = Array.from({ length: segments }, (_, i) => {
        const isFilled = i < filledSegments;
        const isLast = i === filledSegments - 1 && filledSegments > 0;
        return (_jsx("div", { className: `power-conduit__segment ${isFilled ? 'power-conduit__segment--filled' : ''} ${isLast ? 'power-conduit__segment--active' : ''}`, "aria-hidden": "true" }, i));
    });
    return (_jsxs("div", { className: `power-conduit power-conduit--${variant}${isFull ? ' power-conduit--full' : ''} ${className}`, role: "progressbar", "aria-valuenow": value, "aria-valuemin": 0, "aria-valuemax": max, "aria-label": label, children: [_jsx("div", { className: "power-conduit__shadow", "aria-hidden": "true" }), _jsxs("div", { className: "power-conduit__body", children: [_jsx("div", { className: "power-conduit__circuits", "aria-hidden": "true" }), _jsx("div", { className: "power-conduit__track", children: segmentElements }), _jsx("div", { className: "power-conduit__flow", "aria-hidden": "true" }), _jsx("div", { className: "power-conduit__wear", "aria-hidden": "true" })] }), _jsxs("div", { className: "power-conduit__info", children: [_jsx("span", { className: "power-conduit__label", children: label }), _jsxs("span", { className: "power-conduit__value", "data-text": `${roundedPct}%`, children: [roundedPct, "%"] })] }), _jsx("div", { className: "power-conduit__cap power-conduit__cap--left", "aria-hidden": "true" }), _jsx("div", { className: "power-conduit__cap power-conduit__cap--right", "aria-hidden": "true" })] }));
}
export default PowerConduit;
//# sourceMappingURL=PowerConduit.js.map