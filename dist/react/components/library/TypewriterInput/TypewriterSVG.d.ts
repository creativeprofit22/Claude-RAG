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
import React from 'react';
export interface TypewriterSVGRefs {
    frame: SVGGElement | null;
    platen: SVGGElement | null;
    paper: SVGGElement | null;
    typebarBasket: SVGGElement | null;
    typebars: (SVGGElement | null)[];
    ribbon: SVGGElement | null;
    correctionArm: SVGGElement | null;
    carriage: SVGGElement | null;
    bell: SVGGElement | null;
    keyboard: SVGGElement | null;
    keys: Map<string, SVGGElement | null>;
}
export interface TypewriterSVGProps {
    width?: number | string;
    height?: number | string;
    className?: string;
    showKeyboard?: boolean;
}
export declare const TypewriterSVG: React.ForwardRefExoticComponent<TypewriterSVGProps & React.RefAttributes<TypewriterSVGRefs>>;
export default TypewriterSVG;
//# sourceMappingURL=TypewriterSVG.d.ts.map