import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * HudFrame Artifact Component
 * A panel container with stepped corners and targeting reticle decorations
 * Designed as a HUD-style frame, not a simple bordered rectangle
 */
import { memo } from 'react';
import './hud-frame.base.css';
import './hud-frame.cyberpunk.css';
import './hud-frame.library.css';
/** Reticle symbol - crosshair/targeting icon */
const RETICLE_SYMBOL = '\u2295'; // ⊕ circled plus
/** Corner positions for reticle decorations */
const RETICLE_POSITIONS = ['tl', 'tr', 'bl', 'br'];
export const HudFrame = memo(function HudFrame({ children, title, icon, size = 'default', variant = 'default', isLoading = false, hideHeader = false, hideReticles = false, className = '', style, 'aria-label': ariaLabel, }) {
    // Build class names
    const frameClasses = [
        'hud-frame',
        `hud-frame--${size}`,
        variant !== 'default' && `hud-frame--${variant}`,
        isLoading && 'hud-frame--loading',
        (hideHeader || !title) && 'hud-frame--no-header',
        className,
    ]
        .filter(Boolean)
        .join(' ');
    return (_jsx("section", { className: frameClasses, style: style, "aria-label": ariaLabel || title, "aria-busy": isLoading, children: _jsxs("div", { className: "hud-frame__body", children: [_jsx("div", { className: "hud-frame__glow", "aria-hidden": "true" }), !hideHeader && title && (_jsxs("header", { className: "hud-frame__header", children: [icon && (_jsx("span", { className: "hud-frame__title-icon", children: icon })), _jsx("span", { className: "hud-frame__title", children: title })] })), !hideReticles && RETICLE_POSITIONS.map((pos) => (_jsx("span", { className: `hud-frame__reticle hud-frame__reticle--${pos}`, "aria-hidden": "true", children: RETICLE_SYMBOL }, pos))), _jsx("div", { className: "hud-frame__content", children: children }), _jsx("div", { className: "hud-frame__scan", "aria-hidden": "true" })] }) }));
});
export default HudFrame;
//# sourceMappingURL=HudFrame.js.map