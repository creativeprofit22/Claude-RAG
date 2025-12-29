import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './stat-chip.base.css';
import './stat-chip.cyberpunk.css';
export function StatChip({ icon, value, label, meta, isLoading = false, className = '', }) {
    const displayValue = isLoading ? '---' : String(value);
    return (_jsxs("article", { className: `stat-chip ${isLoading ? 'stat-chip--loading' : ''} ${className}`, "aria-label": label, "aria-busy": isLoading, children: [_jsx("div", { className: "stat-chip__shadow", "aria-hidden": "true" }), _jsxs("div", { className: "stat-chip__body", children: [_jsx("div", { className: "stat-chip__circuits", "aria-hidden": "true" }), _jsxs("div", { className: "stat-chip__holo", children: [_jsx("span", { className: "stat-chip__value", "data-text": displayValue, children: displayValue }), _jsx("span", { className: "stat-chip__label", children: label }), meta && _jsx("span", { className: "stat-chip__meta", children: meta })] }), _jsx("div", { className: "stat-chip__wear", "aria-hidden": "true" }), _jsx("div", { className: "stat-chip__icon", children: icon })] }), _jsxs("div", { className: "stat-chip__pins", "aria-hidden": "true", children: [_jsx("span", { className: "stat-chip__pin" }), _jsx("span", { className: "stat-chip__pin" }), _jsx("span", { className: "stat-chip__pin" }), _jsx("span", { className: "stat-chip__pin" }), _jsx("span", { className: "stat-chip__pin" })] })] }));
}
export default StatChip;
//# sourceMappingURL=StatChip.js.map