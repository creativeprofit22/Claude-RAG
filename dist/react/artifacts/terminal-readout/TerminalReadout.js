import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import './terminal-readout.base.css';
import './terminal-readout.cyberpunk.css';
import './terminal-readout.library.css';
/** Calculate bar fill based on status */
function getStatusBarFill(status) {
    switch (status) {
        case 'up': return 100;
        case 'degraded': return 50;
        case 'down': return 0;
        default: return 25;
    }
}
/** Get display text for status */
function getStatusText(status, override) {
    if (override)
        return override;
    switch (status) {
        case 'up': return 'UP';
        case 'degraded': return 'SLOW';
        case 'down': return 'DOWN';
        default: return '???';
    }
}
export function TerminalReadout({ title = 'SYSTEM_HEALTH.exe', services, burnInText = 'SYSTEM INITIALIZED', isLoading = false, className = '', }) {
    return (_jsx("article", { className: `terminal-readout ${isLoading ? 'terminal-readout--loading' : ''} ${className}`, "aria-label": "System Health Terminal", "aria-busy": isLoading, children: _jsxs("div", { className: "terminal-readout__frame", children: [_jsxs("header", { className: "terminal-readout__titlebar", children: [_jsx("span", { className: "terminal-readout__title-icon", "aria-hidden": "true", children: "\u2591\u2592" }), _jsx("span", { className: "terminal-readout__title", children: title })] }), _jsxs("div", { className: "terminal-readout__screen", children: [_jsxs("div", { className: "terminal-readout__services", children: [services.map((service, index) => (_jsxs("div", { className: `terminal-readout__service terminal-readout__service--${service.status}`, style: { '--flicker-delay': `${index * 0.15}s` }, children: [_jsx("div", { className: "terminal-readout__service-icon", children: service.icon }), _jsx("span", { className: "terminal-readout__service-label", children: service.label }), _jsx("div", { className: "terminal-readout__status-bar", role: "meter", "aria-valuenow": getStatusBarFill(service.status), "aria-valuemin": 0, "aria-valuemax": 100, "aria-label": `${service.label} health`, children: _jsx("div", { className: "terminal-readout__status-fill", style: { '--fill-percent': `${getStatusBarFill(service.status)}%` } }) }), _jsx("span", { className: "terminal-readout__status-text", children: getStatusText(service.status, service.statusText) })] }, service.label))), services.length === 0 && !isLoading && (_jsx("div", { className: "terminal-readout__empty", children: "NO SERVICES DETECTED" })), isLoading && services.length === 0 && (_jsx(_Fragment, { children: Array.from({ length: 4 }, (_, i) => (_jsxs("div", { className: "terminal-readout__service terminal-readout__service--skeleton", children: [_jsx("div", { className: "terminal-readout__service-icon", children: "\u25A1" }), _jsx("span", { className: "terminal-readout__service-label", children: "SCANNING..." }), _jsx("div", { className: "terminal-readout__status-bar", children: _jsx("div", { className: "terminal-readout__status-fill" }) }), _jsx("span", { className: "terminal-readout__status-text", children: "---" })] }, i))) }))] }), _jsx("div", { className: "terminal-readout__burnin", "aria-hidden": "true", children: burnInText }), _jsx("div", { className: "terminal-readout__scanlines", "aria-hidden": "true" }), _jsx("div", { className: "terminal-readout__glare", "aria-hidden": "true" })] }), _jsx("footer", { className: "terminal-readout__bezel", children: _jsx("span", { className: "terminal-readout__bezel-label", children: "CRT_FRAME" }) })] }) }));
}
export default TerminalReadout;
//# sourceMappingURL=TerminalReadout.js.map