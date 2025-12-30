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

import React, { forwardRef, useImperativeHandle, useRef, memo } from 'react';

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
// TYPES
// ============================================
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

// ============================================
// KEYBOARD LAYOUT
// ============================================
const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

// ============================================
// COMPONENT (memoized to prevent unnecessary re-renders)
// ============================================
export const TypewriterSVG = memo(forwardRef<TypewriterSVGRefs, TypewriterSVGProps>(
  ({ width = '100%', height = 'auto', className = '', showKeyboard = true }, ref) => {
    // Internal refs for all animatable parts
    const frameRef = useRef<SVGGElement>(null);
    const platenRef = useRef<SVGGElement>(null);
    const paperRef = useRef<SVGGElement>(null);
    const typebarBasketRef = useRef<SVGGElement>(null);
    const typebarRefs = useRef<(SVGGElement | null)[]>([null, null, null, null, null]);
    const ribbonRef = useRef<SVGGElement>(null);
    const correctionArmRef = useRef<SVGGElement>(null);
    const carriageRef = useRef<SVGGElement>(null);
    const bellRef = useRef<SVGGElement>(null);
    const keyboardRef = useRef<SVGGElement>(null);
    const keyRefs = useRef<Map<string, SVGGElement | null>>(new Map());

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

    return (
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        width={width}
        height={height}
        className={`typewriter-svg ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Typewriter illustration"
      >
        {/* ============================================
            DEFINITIONS (Gradients, Filters, Patterns)
            ============================================ */}
        <defs>
          {/* --- Wood Grain Pattern --- */}
          <pattern
            id="tw-wood-grain"
            patternUnits="userSpaceOnUse"
            width="100"
            height="10"
          >
            <rect width="100" height="10" fill={COLORS.walnut.base} />
            <line
              x1="0" y1="2" x2="100" y2="2"
              stroke={COLORS.walnut.grain}
              strokeWidth="0.5"
            />
            <line
              x1="0" y1="5" x2="100" y2="5.2"
              stroke={COLORS.walnut.dark}
              strokeWidth="0.3"
              opacity="0.4"
            />
            <line
              x1="0" y1="8" x2="100" y2="7.8"
              stroke={COLORS.walnut.light}
              strokeWidth="0.4"
              opacity="0.2"
            />
          </pattern>

          {/* --- Paper Texture Pattern --- */}
          <filter id="tw-paper-texture">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="5"
              result="noise"
            />
            <feDiffuseLighting
              in="noise"
              lightingColor={COLORS.paper.base}
              surfaceScale="1.5"
              result="light"
            >
              <feDistantLight azimuth="135" elevation="45" />
            </feDiffuseLighting>
            <feBlend in="SourceGraphic" in2="light" mode="multiply" />
          </filter>

          {/* --- Brass Gradient (Horizontal) --- */}
          <linearGradient id="tw-brass-h" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.brass.shadow} />
            <stop offset="25%" stopColor={COLORS.brass.base} />
            <stop offset="50%" stopColor={COLORS.brass.highlight} />
            <stop offset="75%" stopColor={COLORS.brass.base} />
            <stop offset="100%" stopColor={COLORS.brass.shadow} />
          </linearGradient>

          {/* --- Brass Gradient (Vertical) --- */}
          <linearGradient id="tw-brass-v" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={COLORS.brass.highlight} />
            <stop offset="30%" stopColor={COLORS.brass.base} />
            <stop offset="70%" stopColor={COLORS.brass.base} />
            <stop offset="100%" stopColor={COLORS.brass.shadow} />
          </linearGradient>

          {/* --- Brass Radial (for round keys) --- */}
          <radialGradient id="tw-brass-radial" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor={COLORS.brass.highlight} />
            <stop offset="60%" stopColor={COLORS.brass.base} />
            <stop offset="100%" stopColor={COLORS.brass.shadow} />
          </radialGradient>

          {/* --- Wood Gradient (Walnut) --- */}
          <linearGradient id="tw-walnut-v" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={COLORS.walnut.light} />
            <stop offset="50%" stopColor={COLORS.walnut.base} />
            <stop offset="100%" stopColor={COLORS.walnut.dark} />
          </linearGradient>

          {/* --- Rubber Gradient (for platen) --- */}
          <linearGradient id="tw-rubber" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={COLORS.rubber.highlight} />
            <stop offset="30%" stopColor={COLORS.rubber.base} />
            <stop offset="50%" stopColor={COLORS.rubber.shadow} />
            <stop offset="70%" stopColor={COLORS.rubber.base} />
            <stop offset="100%" stopColor={COLORS.rubber.highlight} />
          </linearGradient>

          {/* --- Paper Gradient (aged parchment) --- */}
          <linearGradient id="tw-paper" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={COLORS.paper.base} />
            <stop offset="50%" stopColor={COLORS.paper.aged} />
            <stop offset="100%" stopColor={COLORS.paper.shadow} />
          </linearGradient>

          {/* --- Ribbon Gradient --- */}
          <linearGradient id="tw-ribbon-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.ribbon.base} />
            <stop offset="50%" stopColor={COLORS.ribbon.highlight} />
            <stop offset="100%" stopColor={COLORS.ribbon.base} />
          </linearGradient>

          {/* --- Drop Shadow Filter --- */}
          <filter id="tw-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.4)" />
          </filter>

          {/* --- Inner Shadow Filter --- */}
          <filter id="tw-inset-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feOffset dx="2" dy="2" />
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="atop" />
          </filter>

          {/* --- Bell Highlight Filter --- */}
          <filter id="tw-bell-glow">
            <feGaussianBlur stdDeviation="2" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* --- Typebar Metal Gradient --- */}
          <linearGradient id="tw-typebar-metal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={COLORS.brass.highlight} />
            <stop offset="20%" stopColor={COLORS.brass.base} />
            <stop offset="80%" stopColor={COLORS.brass.base} />
            <stop offset="100%" stopColor={COLORS.brass.shadow} />
          </linearGradient>

          {/* --- Clip path for paper area --- */}
          <clipPath id="tw-paper-clip">
            <rect x="50" y="35" width="500" height="100" rx="2" />
          </clipPath>
        </defs>

        {/* ============================================
            FRAME - Dark Walnut Body
            ============================================ */}
        <g id="tw-frame" ref={frameRef}>
          {/* Main body */}
          <rect
            x="10"
            y="10"
            width="580"
            height={showKeyboard ? 360 : 260}
            rx="8"
            ry="8"
            fill="url(#tw-wood-grain)"
            stroke={COLORS.walnut.dark}
            strokeWidth="2"
          />
          {/* Wood bevel highlight (top-left) */}
          <rect
            x="12"
            y="12"
            width="576"
            height={showKeyboard ? 356 : 256}
            rx="6"
            ry="6"
            fill="none"
            stroke={COLORS.walnut.light}
            strokeWidth="2"
            opacity="0.3"
          />
          {/* Wood bevel shadow (bottom-right) */}
          <path
            d={`M 586 ${showKeyboard ? 366 : 266} L 586 20 A 8 8 0 0 0 580 14 L 20 14`}
            fill="none"
            stroke={COLORS.walnut.dark}
            strokeWidth="2"
            opacity="0.5"
          />

          {/* Brass accent strip at top */}
          <rect
            x="20"
            y="5"
            width="560"
            height="6"
            rx="3"
            fill="url(#tw-brass-h)"
          />
        </g>

        {/* ============================================
            PLATEN - Paper Roller
            ============================================ */}
        <g id="tw-platen" ref={platenRef}>
          {/* Main roller cylinder */}
          <rect
            x="40"
            y="20"
            width="520"
            height="20"
            rx="10"
            ry="10"
            fill="url(#tw-rubber)"
          />
          {/* Rubber grip lines */}
          {[...Array(26)].map((_, i) => (
            <line
              key={`grip-${i}`}
              x1={60 + i * 20}
              y1="22"
              x2={60 + i * 20}
              y2="38"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          ))}
          {/* Platen knobs (brass) */}
          <circle cx="35" cy="30" r="12" fill="url(#tw-brass-radial)" />
          <circle cx="565" cy="30" r="12" fill="url(#tw-brass-radial)" />
          {/* Knob detail lines */}
          <circle cx="35" cy="30" r="6" fill="none" stroke={COLORS.brass.shadow} strokeWidth="1" />
          <circle cx="565" cy="30" r="6" fill="none" stroke={COLORS.brass.shadow} strokeWidth="1" />
        </g>

        {/* ============================================
            PAPER - Aged Parchment Sheet
            ============================================ */}
        <g id="tw-paper" ref={paperRef} clipPath="url(#tw-paper-clip)">
          {/* Paper background */}
          <rect
            x="50"
            y="35"
            width="500"
            height="100"
            rx="2"
            fill="url(#tw-paper)"
          />
          {/* Paper grain texture overlay */}
          <rect
            x="50"
            y="35"
            width="500"
            height="100"
            fill={COLORS.paper.grain}
            opacity="0.3"
          />
          {/* Paper edge shadow (inset at top under platen) */}
          <rect
            x="50"
            y="35"
            width="500"
            height="8"
            fill="linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 100%)"
          />
          {/* Subtle horizontal lines (typing guide) */}
          {[...Array(4)].map((_, i) => (
            <line
              key={`line-${i}`}
              x1="60"
              y1={55 + i * 22}
              x2="540"
              y2={55 + i * 22}
              stroke={COLORS.paper.shadow}
              strokeWidth="0.5"
              strokeDasharray="1,3"
              opacity="0.4"
            />
          ))}
          {/* Left margin line */}
          <line
            x1="80"
            y1="40"
            x2="80"
            y2="130"
            stroke="#d4a8a8"
            strokeWidth="1"
            opacity="0.3"
          />
        </g>

        {/* ============================================
            CARRIAGE ASSEMBLY - Position Indicator
            ============================================ */}
        <g id="tw-carriage" ref={carriageRef}>
          {/* Carriage rail */}
          <rect
            x="50"
            y="140"
            width="500"
            height="4"
            rx="2"
            fill={COLORS.walnut.dark}
          />
          {/* Carriage marker (brass slider) */}
          <rect
            x="85"
            y="137"
            width="12"
            height="10"
            rx="2"
            fill="url(#tw-brass-v)"
            className="tw-carriage-marker"
          />
          {/* Carriage marker detail */}
          <line
            x1="91"
            y1="139"
            x2="91"
            y2="145"
            stroke={COLORS.brass.highlight}
            strokeWidth="1"
            opacity="0.5"
          />
        </g>

        {/* ============================================
            BELL - Carriage Return Bell
            ============================================ */}
        <g id="tw-bell" ref={bellRef}>
          {/* Bell dome */}
          <ellipse
            cx="530"
            cy="50"
            rx="14"
            ry="12"
            fill="url(#tw-brass-radial)"
          />
          {/* Bell clapper */}
          <circle
            cx="530"
            cy="56"
            r="3"
            fill={COLORS.brass.shadow}
          />
          {/* Bell mount */}
          <rect
            x="524"
            y="35"
            width="12"
            height="6"
            rx="2"
            fill={COLORS.brass.base}
          />
        </g>

        {/* ============================================
            MECHANISM AREA - Typebars + Ribbon
            ============================================ */}
        <g id="tw-mechanism">
          {/* Mechanism housing (recessed area) */}
          <rect
            x="50"
            y="150"
            width="500"
            height="60"
            rx="4"
            fill={COLORS.walnut.dark}
          />
          {/* Inset shadow */}
          <rect
            x="50"
            y="150"
            width="500"
            height="10"
            fill="linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)"
          />

          {/* --- TYPEBAR BASKET --- */}
          <g id="tw-typebar-basket" ref={typebarBasketRef}>
            {/* Basket arc (semi-circular guide) */}
            <path
              d="M 200 205 Q 300 165 400 205"
              fill="none"
              stroke={COLORS.brass.shadow}
              strokeWidth="3"
            />

            {/* Individual typebars */}
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = -30 + i * 15; // Fan out from -30 to 30 degrees
              const baseX = 260 + i * 20;
              const baseY = 205;
              return (
                <g
                  key={`typebar-${i}`}
                  id={`tw-typebar-${i}`}
                  ref={(el) => { typebarRefs.current[i] = el; }}
                  style={{ transformOrigin: `${baseX}px ${baseY}px` }}
                >
                  {/* Typebar arm */}
                  <rect
                    x={baseX - 2}
                    y={baseY - 35}
                    width="4"
                    height="35"
                    rx="1"
                    fill="url(#tw-typebar-metal)"
                    transform={`rotate(${angle} ${baseX} ${baseY})`}
                  />
                  {/* Type head (letter stamp) */}
                  <rect
                    x={baseX - 4}
                    y={baseY - 42}
                    width="8"
                    height="8"
                    rx="1"
                    fill={COLORS.brass.base}
                    transform={`rotate(${angle} ${baseX} ${baseY})`}
                  />
                </g>
              );
            })}
          </g>

          {/* --- RIBBON MECHANISM --- */}
          <g id="tw-ribbon" ref={ribbonRef}>
            {/* Ribbon housing */}
            <rect
              x="265"
              y="155"
              width="70"
              height="25"
              rx="4"
              fill="url(#tw-ribbon-grad)"
            />
            {/* Left spool */}
            <circle cx="280" cy="167" r="10" fill={COLORS.ribbon.base} />
            <circle cx="280" cy="167" r="5" fill={COLORS.brass.shadow} />
            {/* Right spool */}
            <circle cx="320" cy="167" r="10" fill={COLORS.ribbon.base} />
            <circle cx="320" cy="167" r="5" fill={COLORS.brass.shadow} />
            {/* Ribbon strip between spools */}
            <rect
              x="285"
              y="164"
              width="30"
              height="6"
              fill="#1a0a0a"
            />
          </g>

          {/* --- CORRECTION TAPE ARM --- */}
          <g
            id="tw-correction-arm"
            ref={correctionArmRef}
            style={{ transformOrigin: '450px 180px', opacity: 0 }}
          >
            {/* Arm */}
            <rect
              x="410"
              y="176"
              width="45"
              height="8"
              rx="2"
              fill="url(#tw-brass-h)"
            />
            {/* Tape roll mount */}
            <circle cx="418" cy="180" r="6" fill={COLORS.brass.base} />
            {/* Correction tape (white) */}
            <rect
              x="412"
              y="177"
              width="12"
              height="6"
              rx="1"
              fill={COLORS.correction.tape}
            />
          </g>
        </g>

        {/* ============================================
            KEYBOARD - Cropped View (Desktop only)
            ============================================ */}
        {showKeyboard && (
          <g id="tw-keyboard" ref={keyboardRef}>
            {/* Keyboard base plate */}
            <rect
              x="50"
              y="220"
              width="500"
              height="130"
              rx="4"
              fill={COLORS.walnut.base}
            />
            {/* Gradient fade at bottom (cropped effect) */}
            <rect
              x="50"
              y="310"
              width="500"
              height="40"
              fill="linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 100%)"
            />

            {/* Render key rows */}
            {KEYBOARD_ROWS.map((row, rowIndex) => {
              const rowY = 240 + rowIndex * 32;
              const rowOffset = rowIndex * 8; // Stagger offset
              const startX = 110 + rowOffset;

              return (
                <g key={`row-${rowIndex}`} className="tw-key-row">
                  {row.map((key, keyIndex) => {
                    const keyX = startX + keyIndex * 40;
                    return (
                      <g
                        key={key}
                        id={`tw-key-${key}`}
                        ref={(el) => { keyRefs.current.set(key, el); }}
                        className="tw-key"
                      >
                        {/* Key shadow */}
                        <ellipse
                          cx={keyX}
                          cy={rowY + 4}
                          rx="14"
                          ry="12"
                          fill="rgba(0,0,0,0.3)"
                        />
                        {/* Key cap (round brass) */}
                        <circle
                          cx={keyX}
                          cy={rowY}
                          r="14"
                          fill="url(#tw-brass-radial)"
                        />
                        {/* Key ring (inner edge) */}
                        <circle
                          cx={keyX}
                          cy={rowY}
                          r="11"
                          fill="none"
                          stroke={COLORS.brass.shadow}
                          strokeWidth="1"
                          opacity="0.5"
                        />
                        {/* Key letter */}
                        <text
                          x={keyX}
                          y={rowY + 4}
                          textAnchor="middle"
                          fontSize="10"
                          fontFamily="'Courier New', monospace"
                          fontWeight="bold"
                          fill={COLORS.walnut.dark}
                        >
                          {key}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* Space bar */}
            <g
              id="tw-key-SPACE"
              ref={(el) => { keyRefs.current.set('SPACE', el); }}
              className="tw-key tw-key-space"
            >
              {/* Space bar shadow */}
              <rect
                x="180"
                y="340"
                width="240"
                height="20"
                rx="10"
                fill="rgba(0,0,0,0.3)"
              />
              {/* Space bar cap */}
              <rect
                x="180"
                y="336"
                width="240"
                height="20"
                rx="10"
                fill="url(#tw-brass-h)"
              />
              {/* Space bar edge highlight */}
              <rect
                x="182"
                y="338"
                width="236"
                height="16"
                rx="8"
                fill="none"
                stroke={COLORS.brass.highlight}
                strokeWidth="1"
                opacity="0.3"
              />
            </g>
          </g>
        )}

        {/* ============================================
            DECORATIVE ACCENTS
            ============================================ */}
        <g id="tw-accents">
          {/* Brass corner accents */}
          <path
            d="M 20 20 L 40 20 L 40 25 L 25 25 L 25 40 L 20 40 Z"
            fill="url(#tw-brass-v)"
          />
          <path
            d="M 580 20 L 560 20 L 560 25 L 575 25 L 575 40 L 580 40 Z"
            fill="url(#tw-brass-v)"
          />
          <path
            d={`M 20 ${showKeyboard ? 360 : 260} L 40 ${showKeyboard ? 360 : 260} L 40 ${showKeyboard ? 355 : 255} L 25 ${showKeyboard ? 355 : 255} L 25 ${showKeyboard ? 340 : 240} L 20 ${showKeyboard ? 340 : 240} Z`}
            fill="url(#tw-brass-v)"
          />
          <path
            d={`M 580 ${showKeyboard ? 360 : 260} L 560 ${showKeyboard ? 360 : 260} L 560 ${showKeyboard ? 355 : 255} L 575 ${showKeyboard ? 355 : 255} L 575 ${showKeyboard ? 340 : 240} L 580 ${showKeyboard ? 340 : 240} Z`}
            fill="url(#tw-brass-v)"
          />

          {/* Brand plaque (optional decorative element) */}
          <rect
            x="250"
            y={showKeyboard ? 365 : 265}
            width="100"
            height="8"
            rx="2"
            fill="url(#tw-brass-h)"
          />
        </g>
      </svg>
    );
  }
));

TypewriterSVG.displayName = 'TypewriterSVG';

export default TypewriterSVG;
