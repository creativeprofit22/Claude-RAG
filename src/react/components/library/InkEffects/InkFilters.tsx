/**
 * InkFilters Component
 * Library Skin V2: Typewriter Edition
 *
 * Injects SVG filter definitions into the DOM.
 * Must be rendered once at the app root for filters to work.
 *
 * Tech: React + SVG
 */

import React from 'react';

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
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute',
        width: 0,
        height: 0,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      <defs>
        {/* Paper Bleed Filter - Feathers text edges into paper grain */}
        <filter id="paper-bleed-filter" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="5"
            seed="15"
            result="grain"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="grain"
            scale="1.5"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="0.3" result="blurred" />
          <feComponentTransfer in="blurred" result="enhanced">
            <feFuncA type="linear" slope="1.3" intercept="-0.1" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="enhanced" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Ink Spread Filter - Organic blob spreading */}
        <filter id="ink-spread-filter" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.02"
            numOctaves="3"
            seed="42"
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="12"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="2" result="spread" />
          <feComponentTransfer in="spread" result="inky">
            <feFuncA type="table" tableValues="0 0 0.3 0.7 1 1" />
          </feComponentTransfer>
          <feColorMatrix
            in="inky"
            type="matrix"
            values="0.1 0 0 0 0
                    0.07 0 0 0 0
                    0.03 0 0 0 0
                    0 0 0 1 0"
          />
        </filter>

        {/* Wet Sheen Filter - Glossy wet ink appearance */}
        <filter id="wet-sheen-filter" x="-5%" y="-5%" width="110%" height="110%">
          <feSpecularLighting
            in="SourceAlpha"
            surfaceScale="3"
            specularConstant="0.8"
            specularExponent="25"
            result="specular"
          >
            <fePointLight x="-100" y="-100" z="200" />
          </feSpecularLighting>
          <feComposite
            in="specular"
            in2="SourceAlpha"
            operator="in"
            result="specularMasked"
          />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="specularMasked" />
          </feMerge>
        </filter>

        {/* Ink Drop Filter - Soft organic edges for drops */}
        <filter id="ink-drop-filter" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="4"
            xChannelSelector="R"
            yChannelSelector="G"
            result="organic"
          />
          <feGaussianBlur in="organic" stdDeviation="0.8" result="blurred" />
          <feComponentTransfer in="blurred">
            <feFuncA type="linear" slope="1.5" intercept="0" />
          </feComponentTransfer>
        </filter>

        {/* Ink Swirl Filter - Fluid motion for processing */}
        <filter id="ink-swirl-filter" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.01"
            numOctaves="2"
            seed="99"
            result="swirl"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="swirl"
            scale="6"
            xChannelSelector="R"
            yChannelSelector="B"
          />
        </filter>

        {/* Blotting Paper Filter - Absorbs/fades ink blot */}
        <filter id="blotting-filter" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.1"
            numOctaves="6"
            seed="33"
            result="paper"
          />
          <feBlend in="SourceGraphic" in2="paper" mode="multiply" result="absorbed" />
          <feGaussianBlur in="absorbed" stdDeviation="1" />
        </filter>

        {/* Aged Ink Filter - Old document simulation */}
        <filter id="aged-ink-filter" x="0" y="0" width="100%" height="100%">
          <feColorMatrix type="saturate" values="0.6" result="desaturated" />
          <feColorMatrix
            in="desaturated"
            type="matrix"
            values="0.55 0.35 0.1 0 0
                    0.45 0.35 0.1 0 0
                    0.35 0.25 0.1 0 0
                    0 0 0 0.7 0"
          />
        </filter>

        {/* Ink Wash Filter - Page transition wipe */}
        <filter id="ink-wash-filter" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.005"
            numOctaves="2"
            seed="88"
            result="wash"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="wash"
            scale="20"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* Ink Pool Filter - Hover effect */}
        <filter id="ink-pool-filter" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="pool" />
          <feComposite in="SourceGraphic" in2="pool" operator="over" />
        </filter>

        {/* Selection Bleed Filter - Highlight bleed-through */}
        <filter id="selection-bleed-filter" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="bled" />
          <feComponentTransfer in="bled">
            <feFuncA type="linear" slope="0.6" intercept="0" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}

export default InkFilters;
