import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * TypewriterSVG Component
 * Library Skin V2: Typewriter Edition
 *
 * Detailed SVG visual component for the typewriter input.
 * Exposes refs for all animatable parts for GSAP targeting.
 *
 * Materials: Dark walnut body, antique brass accents, aged paper
 * Light source: Top-left (~30deg), warm amber lighting
 */
import { forwardRef, useImperativeHandle, useRef } from 'react';
// ============================================
// COLOR PALETTE (from library-base.css + spec)
// ============================================
const COLORS = {
    // Brass (antique patina)
    brass: {
        base: '#8B7028',
        highlight: '#B8A050',
        shadow: '#4A3A10',
        verdigris: 'rgba(82, 140, 120, 0.12)',
    },
    // Wood (dark walnut)
    walnut: {
        base: '#3D2B1F',
        light: '#5C4332',
        dark: '#241810',
        grain: 'rgba(40, 25, 20, 0.15)',
    },
    // Paper (aged parchment)
    paper: {
        base: '#f4e6c8',
        aged: '#e8dab8',
        shadow: '#d4c6a8',
        grain: 'rgba(139, 112, 40, 0.05)',
    },
    // Ink
    ink: {
        primary: '#1a1208',
        fresh: '#2c1810',
        bleed: 'rgba(26, 18, 8, 0.8)',
    },
    // Rubber (for platen)
    rubber: {
        base: '#1a1a1a',
        highlight: '#2a2a2a',
        shadow: '#0a0a0a',
    },
    // Ribbon
    ribbon: {
        base: '#1a1a1a',
        highlight: '#2a2a2a',
    },
    // Correction tape
    correction: {
        tape: '#f8f8f8',
        shadow: 'rgba(0, 0, 0, 0.2)',
    },
};
// ============================================
// KEYBOARD LAYOUT
// ============================================
const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];
// ============================================
// COMPONENT
// ============================================
export const TypewriterSVG = forwardRef(({ width = '100%', height = 'auto', className = '', showKeyboard = true }, ref) => {
    // Internal refs for all animatable parts
    const frameRef = useRef(null);
    const platenRef = useRef(null);
    const paperRef = useRef(null);
    const typebarBasketRef = useRef(null);
    const typebarRefs = useRef([null, null, null, null, null]);
    const ribbonRef = useRef(null);
    const correctionArmRef = useRef(null);
    const carriageRef = useRef(null);
    const bellRef = useRef(null);
    const keyboardRef = useRef(null);
    const keyRefs = useRef(new Map());
    // Expose refs to parent component
    useImperativeHandle(ref, () => ({
        frame: frameRef.current,
        platen: platenRef.current,
        paper: paperRef.current,
        typebarBasket: typebarBasketRef.current,
        typebars: typebarRefs.current,
        ribbon: ribbonRef.current,
        correctionArm: correctionArmRef.current,
        carriage: carriageRef.current,
        bell: bellRef.current,
        keyboard: keyboardRef.current,
        keys: keyRefs.current,
    }));
    // Calculate viewBox dimensions
    const viewBoxWidth = 600;
    const viewBoxHeight = showKeyboard ? 380 : 280;
    return (_jsxs("svg", { viewBox: `0 0 ${viewBoxWidth} ${viewBoxHeight}`, width: width, height: height, className: `typewriter-svg ${className}`, xmlns: "http://www.w3.org/2000/svg", role: "img", "aria-label": "Typewriter illustration", children: [_jsxs("defs", { children: [_jsxs("pattern", { id: "tw-wood-grain", patternUnits: "userSpaceOnUse", width: "100", height: "10", children: [_jsx("rect", { width: "100", height: "10", fill: COLORS.walnut.base }), _jsx("line", { x1: "0", y1: "2", x2: "100", y2: "2", stroke: COLORS.walnut.grain, strokeWidth: "0.5" }), _jsx("line", { x1: "0", y1: "5", x2: "100", y2: "5.2", stroke: COLORS.walnut.dark, strokeWidth: "0.3", opacity: "0.4" }), _jsx("line", { x1: "0", y1: "8", x2: "100", y2: "7.8", stroke: COLORS.walnut.light, strokeWidth: "0.4", opacity: "0.2" })] }), _jsxs("filter", { id: "tw-paper-texture", children: [_jsx("feTurbulence", { type: "fractalNoise", baseFrequency: "0.04", numOctaves: "5", result: "noise" }), _jsx("feDiffuseLighting", { in: "noise", lightingColor: COLORS.paper.base, surfaceScale: "1.5", result: "light", children: _jsx("feDistantLight", { azimuth: "135", elevation: "45" }) }), _jsx("feBlend", { in: "SourceGraphic", in2: "light", mode: "multiply" })] }), _jsxs("linearGradient", { id: "tw-brass-h", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [_jsx("stop", { offset: "0%", stopColor: COLORS.brass.shadow }), _jsx("stop", { offset: "25%", stopColor: COLORS.brass.base }), _jsx("stop", { offset: "50%", stopColor: COLORS.brass.highlight }), _jsx("stop", { offset: "75%", stopColor: COLORS.brass.base }), _jsx("stop", { offset: "100%", stopColor: COLORS.brass.shadow })] }), _jsxs("linearGradient", { id: "tw-brass-v", x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: COLORS.brass.highlight }), _jsx("stop", { offset: "30%", stopColor: COLORS.brass.base }), _jsx("stop", { offset: "70%", stopColor: COLORS.brass.base }), _jsx("stop", { offset: "100%", stopColor: COLORS.brass.shadow })] }), _jsxs("radialGradient", { id: "tw-brass-radial", cx: "30%", cy: "30%", r: "70%", children: [_jsx("stop", { offset: "0%", stopColor: COLORS.brass.highlight }), _jsx("stop", { offset: "60%", stopColor: COLORS.brass.base }), _jsx("stop", { offset: "100%", stopColor: COLORS.brass.shadow })] }), _jsxs("linearGradient", { id: "tw-walnut-v", x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: COLORS.walnut.light }), _jsx("stop", { offset: "50%", stopColor: COLORS.walnut.base }), _jsx("stop", { offset: "100%", stopColor: COLORS.walnut.dark })] }), _jsxs("linearGradient", { id: "tw-rubber", x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: COLORS.rubber.highlight }), _jsx("stop", { offset: "30%", stopColor: COLORS.rubber.base }), _jsx("stop", { offset: "50%", stopColor: COLORS.rubber.shadow }), _jsx("stop", { offset: "70%", stopColor: COLORS.rubber.base }), _jsx("stop", { offset: "100%", stopColor: COLORS.rubber.highlight })] }), _jsxs("linearGradient", { id: "tw-paper", x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: COLORS.paper.base }), _jsx("stop", { offset: "50%", stopColor: COLORS.paper.aged }), _jsx("stop", { offset: "100%", stopColor: COLORS.paper.shadow })] }), _jsxs("linearGradient", { id: "tw-ribbon-grad", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [_jsx("stop", { offset: "0%", stopColor: COLORS.ribbon.base }), _jsx("stop", { offset: "50%", stopColor: COLORS.ribbon.highlight }), _jsx("stop", { offset: "100%", stopColor: COLORS.ribbon.base })] }), _jsx("filter", { id: "tw-shadow", x: "-20%", y: "-20%", width: "140%", height: "140%", children: _jsx("feDropShadow", { dx: "2", dy: "4", stdDeviation: "3", floodColor: "rgba(0,0,0,0.4)" }) }), _jsxs("filter", { id: "tw-inset-shadow", x: "-20%", y: "-20%", width: "140%", height: "140%", children: [_jsx("feOffset", { dx: "2", dy: "2" }), _jsx("feGaussianBlur", { stdDeviation: "2", result: "blur" }), _jsx("feComposite", { in: "SourceGraphic", in2: "blur", operator: "atop" })] }), _jsxs("filter", { id: "tw-bell-glow", children: [_jsx("feGaussianBlur", { stdDeviation: "2", result: "glow" }), _jsxs("feMerge", { children: [_jsx("feMergeNode", { in: "glow" }), _jsx("feMergeNode", { in: "SourceGraphic" })] })] }), _jsxs("linearGradient", { id: "tw-typebar-metal", x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: COLORS.brass.highlight }), _jsx("stop", { offset: "20%", stopColor: COLORS.brass.base }), _jsx("stop", { offset: "80%", stopColor: COLORS.brass.base }), _jsx("stop", { offset: "100%", stopColor: COLORS.brass.shadow })] }), _jsx("clipPath", { id: "tw-paper-clip", children: _jsx("rect", { x: "50", y: "35", width: "500", height: "100", rx: "2" }) })] }), _jsxs("g", { id: "tw-frame", ref: frameRef, children: [_jsx("rect", { x: "10", y: "10", width: "580", height: showKeyboard ? 360 : 260, rx: "8", ry: "8", fill: "url(#tw-wood-grain)", stroke: COLORS.walnut.dark, strokeWidth: "2" }), _jsx("rect", { x: "12", y: "12", width: "576", height: showKeyboard ? 356 : 256, rx: "6", ry: "6", fill: "none", stroke: COLORS.walnut.light, strokeWidth: "2", opacity: "0.3" }), _jsx("path", { d: `M 586 ${showKeyboard ? 366 : 266} L 586 20 A 8 8 0 0 0 580 14 L 20 14`, fill: "none", stroke: COLORS.walnut.dark, strokeWidth: "2", opacity: "0.5" }), _jsx("rect", { x: "20", y: "5", width: "560", height: "6", rx: "3", fill: "url(#tw-brass-h)" })] }), _jsxs("g", { id: "tw-platen", ref: platenRef, children: [_jsx("rect", { x: "40", y: "20", width: "520", height: "20", rx: "10", ry: "10", fill: "url(#tw-rubber)" }), [...Array(26)].map((_, i) => (_jsx("line", { x1: 60 + i * 20, y1: "22", x2: 60 + i * 20, y2: "38", stroke: "rgba(255,255,255,0.05)", strokeWidth: "1" }, `grip-${i}`))), _jsx("circle", { cx: "35", cy: "30", r: "12", fill: "url(#tw-brass-radial)" }), _jsx("circle", { cx: "565", cy: "30", r: "12", fill: "url(#tw-brass-radial)" }), _jsx("circle", { cx: "35", cy: "30", r: "6", fill: "none", stroke: COLORS.brass.shadow, strokeWidth: "1" }), _jsx("circle", { cx: "565", cy: "30", r: "6", fill: "none", stroke: COLORS.brass.shadow, strokeWidth: "1" })] }), _jsxs("g", { id: "tw-paper", ref: paperRef, clipPath: "url(#tw-paper-clip)", children: [_jsx("rect", { x: "50", y: "35", width: "500", height: "100", rx: "2", fill: "url(#tw-paper)" }), _jsx("rect", { x: "50", y: "35", width: "500", height: "100", fill: COLORS.paper.grain, opacity: "0.3" }), _jsx("rect", { x: "50", y: "35", width: "500", height: "8", fill: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 100%)" }), [...Array(4)].map((_, i) => (_jsx("line", { x1: "60", y1: 55 + i * 22, x2: "540", y2: 55 + i * 22, stroke: COLORS.paper.shadow, strokeWidth: "0.5", strokeDasharray: "1,3", opacity: "0.4" }, `line-${i}`))), _jsx("line", { x1: "80", y1: "40", x2: "80", y2: "130", stroke: "#d4a8a8", strokeWidth: "1", opacity: "0.3" })] }), _jsxs("g", { id: "tw-carriage", ref: carriageRef, children: [_jsx("rect", { x: "50", y: "140", width: "500", height: "4", rx: "2", fill: COLORS.walnut.dark }), _jsx("rect", { x: "85", y: "137", width: "12", height: "10", rx: "2", fill: "url(#tw-brass-v)", className: "tw-carriage-marker" }), _jsx("line", { x1: "91", y1: "139", x2: "91", y2: "145", stroke: COLORS.brass.highlight, strokeWidth: "1", opacity: "0.5" })] }), _jsxs("g", { id: "tw-bell", ref: bellRef, children: [_jsx("ellipse", { cx: "530", cy: "50", rx: "14", ry: "12", fill: "url(#tw-brass-radial)" }), _jsx("circle", { cx: "530", cy: "56", r: "3", fill: COLORS.brass.shadow }), _jsx("rect", { x: "524", y: "35", width: "12", height: "6", rx: "2", fill: COLORS.brass.base })] }), _jsxs("g", { id: "tw-mechanism", children: [_jsx("rect", { x: "50", y: "150", width: "500", height: "60", rx: "4", fill: COLORS.walnut.dark }), _jsx("rect", { x: "50", y: "150", width: "500", height: "10", fill: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)" }), _jsxs("g", { id: "tw-typebar-basket", ref: typebarBasketRef, children: [_jsx("path", { d: "M 200 205 Q 300 165 400 205", fill: "none", stroke: COLORS.brass.shadow, strokeWidth: "3" }), [0, 1, 2, 3, 4].map((i) => {
                                const angle = -30 + i * 15; // Fan out from -30 to 30 degrees
                                const baseX = 260 + i * 20;
                                const baseY = 205;
                                return (_jsxs("g", { id: `tw-typebar-${i}`, ref: (el) => { typebarRefs.current[i] = el; }, style: { transformOrigin: `${baseX}px ${baseY}px` }, children: [_jsx("rect", { x: baseX - 2, y: baseY - 35, width: "4", height: "35", rx: "1", fill: "url(#tw-typebar-metal)", transform: `rotate(${angle} ${baseX} ${baseY})` }), _jsx("rect", { x: baseX - 4, y: baseY - 42, width: "8", height: "8", rx: "1", fill: COLORS.brass.base, transform: `rotate(${angle} ${baseX} ${baseY})` })] }, `typebar-${i}`));
                            })] }), _jsxs("g", { id: "tw-ribbon", ref: ribbonRef, children: [_jsx("rect", { x: "265", y: "155", width: "70", height: "25", rx: "4", fill: "url(#tw-ribbon-grad)" }), _jsx("circle", { cx: "280", cy: "167", r: "10", fill: COLORS.ribbon.base }), _jsx("circle", { cx: "280", cy: "167", r: "5", fill: COLORS.brass.shadow }), _jsx("circle", { cx: "320", cy: "167", r: "10", fill: COLORS.ribbon.base }), _jsx("circle", { cx: "320", cy: "167", r: "5", fill: COLORS.brass.shadow }), _jsx("rect", { x: "285", y: "164", width: "30", height: "6", fill: "#1a0a0a" })] }), _jsxs("g", { id: "tw-correction-arm", ref: correctionArmRef, style: { transformOrigin: '450px 180px', opacity: 0 }, children: [_jsx("rect", { x: "410", y: "176", width: "45", height: "8", rx: "2", fill: "url(#tw-brass-h)" }), _jsx("circle", { cx: "418", cy: "180", r: "6", fill: COLORS.brass.base }), _jsx("rect", { x: "412", y: "177", width: "12", height: "6", rx: "1", fill: COLORS.correction.tape })] })] }), showKeyboard && (_jsxs("g", { id: "tw-keyboard", ref: keyboardRef, children: [_jsx("rect", { x: "50", y: "220", width: "500", height: "130", rx: "4", fill: COLORS.walnut.base }), _jsx("rect", { x: "50", y: "310", width: "500", height: "40", fill: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 100%)" }), KEYBOARD_ROWS.map((row, rowIndex) => {
                        const rowY = 240 + rowIndex * 32;
                        const rowOffset = rowIndex * 8; // Stagger offset
                        const startX = 110 + rowOffset;
                        return (_jsx("g", { className: "tw-key-row", children: row.map((key, keyIndex) => {
                                const keyX = startX + keyIndex * 40;
                                return (_jsxs("g", { id: `tw-key-${key}`, ref: (el) => { keyRefs.current.set(key, el); }, className: "tw-key", children: [_jsx("ellipse", { cx: keyX, cy: rowY + 4, rx: "14", ry: "12", fill: "rgba(0,0,0,0.3)" }), _jsx("circle", { cx: keyX, cy: rowY, r: "14", fill: "url(#tw-brass-radial)" }), _jsx("circle", { cx: keyX, cy: rowY, r: "11", fill: "none", stroke: COLORS.brass.shadow, strokeWidth: "1", opacity: "0.5" }), _jsx("text", { x: keyX, y: rowY + 4, textAnchor: "middle", fontSize: "10", fontFamily: "'Courier New', monospace", fontWeight: "bold", fill: COLORS.walnut.dark, children: key })] }, key));
                            }) }, `row-${rowIndex}`));
                    }), _jsxs("g", { id: "tw-key-SPACE", ref: (el) => { keyRefs.current.set('SPACE', el); }, className: "tw-key tw-key-space", children: [_jsx("rect", { x: "180", y: "340", width: "240", height: "20", rx: "10", fill: "rgba(0,0,0,0.3)" }), _jsx("rect", { x: "180", y: "336", width: "240", height: "20", rx: "10", fill: "url(#tw-brass-h)" }), _jsx("rect", { x: "182", y: "338", width: "236", height: "16", rx: "8", fill: "none", stroke: COLORS.brass.highlight, strokeWidth: "1", opacity: "0.3" })] })] })), _jsxs("g", { id: "tw-accents", children: [_jsx("path", { d: "M 20 20 L 40 20 L 40 25 L 25 25 L 25 40 L 20 40 Z", fill: "url(#tw-brass-v)" }), _jsx("path", { d: "M 580 20 L 560 20 L 560 25 L 575 25 L 575 40 L 580 40 Z", fill: "url(#tw-brass-v)" }), _jsx("path", { d: `M 20 ${showKeyboard ? 360 : 260} L 40 ${showKeyboard ? 360 : 260} L 40 ${showKeyboard ? 355 : 255} L 25 ${showKeyboard ? 355 : 255} L 25 ${showKeyboard ? 340 : 240} L 20 ${showKeyboard ? 340 : 240} Z`, fill: "url(#tw-brass-v)" }), _jsx("path", { d: `M 580 ${showKeyboard ? 360 : 260} L 560 ${showKeyboard ? 360 : 260} L 560 ${showKeyboard ? 355 : 255} L 575 ${showKeyboard ? 355 : 255} L 575 ${showKeyboard ? 340 : 240} L 580 ${showKeyboard ? 340 : 240} Z`, fill: "url(#tw-brass-v)" }), _jsx("rect", { x: "250", y: showKeyboard ? 365 : 265, width: "100", height: "8", rx: "2", fill: "url(#tw-brass-h)" })] })] }));
});
TypewriterSVG.displayName = 'TypewriterSVG';
export default TypewriterSVG;
//# sourceMappingURL=TypewriterSVG.js.map