import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * InkFilters - SVG filter definitions for ink effects.
 *
 * This component must be included once in your app (typically near the root)
 * for the ink effect filters to work properly.
 *
 * @example
 * ```tsx
 * // In your App.tsx or layout component:
 * import { InkFilters } from '@/components/library/InkEffects';
 *
 * function App() {
 *   return (
 *     <>
 *       <InkFilters />
 *       <MainContent />
 *     </>
 *   );
 * }
 * ```
 */
export function InkFilters() {
    return (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", style: {
            position: 'absolute',
            width: 0,
            height: 0,
            overflow: 'hidden',
        }, "aria-hidden": "true", children: _jsxs("defs", { children: [_jsxs("filter", { id: "paper-bleed-filter", x: "-10%", y: "-10%", width: "120%", height: "120%", children: [_jsx("feTurbulence", { type: "fractalNoise", baseFrequency: "0.04", numOctaves: "5", seed: "15", result: "grain" }), _jsx("feDisplacementMap", { in: "SourceGraphic", in2: "grain", scale: "1.5", xChannelSelector: "R", yChannelSelector: "G", result: "displaced" }), _jsx("feGaussianBlur", { in: "displaced", stdDeviation: "0.3", result: "blurred" }), _jsx("feComponentTransfer", { in: "blurred", result: "enhanced", children: _jsx("feFuncA", { type: "linear", slope: "1.3", intercept: "-0.1" }) }), _jsxs("feMerge", { children: [_jsx("feMergeNode", { in: "enhanced" }), _jsx("feMergeNode", { in: "SourceGraphic" })] })] }), _jsxs("filter", { id: "ink-spread-filter", x: "-50%", y: "-50%", width: "200%", height: "200%", children: [_jsx("feTurbulence", { type: "turbulence", baseFrequency: "0.02", numOctaves: "3", seed: "42", result: "turbulence" }), _jsx("feDisplacementMap", { in: "SourceGraphic", in2: "turbulence", scale: "12", xChannelSelector: "R", yChannelSelector: "G", result: "displaced" }), _jsx("feGaussianBlur", { in: "displaced", stdDeviation: "2", result: "spread" }), _jsx("feComponentTransfer", { in: "spread", result: "inky", children: _jsx("feFuncA", { type: "table", tableValues: "0 0 0.3 0.7 1 1" }) }), _jsx("feColorMatrix", { in: "inky", type: "matrix", values: "0.1 0 0 0 0\n                    0.07 0 0 0 0\n                    0.03 0 0 0 0\n                    0 0 0 1 0" })] }), _jsxs("filter", { id: "wet-sheen-filter", x: "-5%", y: "-5%", width: "110%", height: "110%", children: [_jsx("feSpecularLighting", { in: "SourceAlpha", surfaceScale: "3", specularConstant: "0.8", specularExponent: "25", result: "specular", children: _jsx("fePointLight", { x: "-100", y: "-100", z: "200" }) }), _jsx("feComposite", { in: "specular", in2: "SourceAlpha", operator: "in", result: "specularMasked" }), _jsxs("feMerge", { children: [_jsx("feMergeNode", { in: "SourceGraphic" }), _jsx("feMergeNode", { in: "specularMasked" })] })] }), _jsxs("filter", { id: "ink-drop-filter", x: "-30%", y: "-30%", width: "160%", height: "160%", children: [_jsx("feTurbulence", { type: "fractalNoise", baseFrequency: "0.03", numOctaves: "2", seed: "7", result: "noise" }), _jsx("feDisplacementMap", { in: "SourceGraphic", in2: "noise", scale: "4", xChannelSelector: "R", yChannelSelector: "G", result: "organic" }), _jsx("feGaussianBlur", { in: "organic", stdDeviation: "0.8", result: "blurred" }), _jsx("feComponentTransfer", { in: "blurred", children: _jsx("feFuncA", { type: "linear", slope: "1.5", intercept: "0" }) })] }), _jsxs("filter", { id: "ink-swirl-filter", x: "-20%", y: "-20%", width: "140%", height: "140%", children: [_jsx("feTurbulence", { type: "turbulence", baseFrequency: "0.01", numOctaves: "2", seed: "99", result: "swirl" }), _jsx("feDisplacementMap", { in: "SourceGraphic", in2: "swirl", scale: "6", xChannelSelector: "R", yChannelSelector: "B" })] }), _jsxs("filter", { id: "blotting-filter", x: "-10%", y: "-10%", width: "120%", height: "120%", children: [_jsx("feTurbulence", { type: "fractalNoise", baseFrequency: "0.1", numOctaves: "6", seed: "33", result: "paper" }), _jsx("feBlend", { in: "SourceGraphic", in2: "paper", mode: "multiply", result: "absorbed" }), _jsx("feGaussianBlur", { in: "absorbed", stdDeviation: "1" })] }), _jsxs("filter", { id: "aged-ink-filter", x: "0", y: "0", width: "100%", height: "100%", children: [_jsx("feColorMatrix", { type: "saturate", values: "0.6", result: "desaturated" }), _jsx("feColorMatrix", { in: "desaturated", type: "matrix", values: "0.55 0.35 0.1 0 0\n                    0.45 0.35 0.1 0 0\n                    0.35 0.25 0.1 0 0\n                    0 0 0 0.7 0" })] }), _jsxs("filter", { id: "ink-wash-filter", x: "-10%", y: "-10%", width: "120%", height: "120%", children: [_jsx("feTurbulence", { type: "turbulence", baseFrequency: "0.005", numOctaves: "2", seed: "88", result: "wash" }), _jsx("feDisplacementMap", { in: "SourceGraphic", in2: "wash", scale: "20", xChannelSelector: "R", yChannelSelector: "G" })] }), _jsxs("filter", { id: "ink-pool-filter", x: "-5%", y: "-5%", width: "110%", height: "110%", children: [_jsx("feGaussianBlur", { in: "SourceGraphic", stdDeviation: "1.5", result: "pool" }), _jsx("feComposite", { in: "SourceGraphic", in2: "pool", operator: "over" })] }), _jsxs("filter", { id: "selection-bleed-filter", x: "-5%", y: "-5%", width: "110%", height: "110%", children: [_jsx("feGaussianBlur", { in: "SourceGraphic", stdDeviation: "0.5", result: "bled" }), _jsx("feComponentTransfer", { in: "bled", children: _jsx("feFuncA", { type: "linear", slope: "0.6", intercept: "0" }) })] })] }) }));
}
export default InkFilters;
//# sourceMappingURL=InkFilters.js.map