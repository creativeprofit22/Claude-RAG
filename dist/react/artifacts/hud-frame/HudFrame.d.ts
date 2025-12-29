/**
 * HudFrame Artifact Component
 * A panel container with stepped corners and targeting reticle decorations
 * Designed as a HUD-style frame, not a simple bordered rectangle
 */
import React from 'react';
import './hud-frame.base.css';
import './hud-frame.cyberpunk.css';
import './hud-frame.library.css';
export type HudFrameSize = 'compact' | 'default' | 'spacious';
export type HudFrameVariant = 'default' | 'alert' | 'warning' | 'success';
export interface HudFrameProps {
    /** Content to display inside the frame */
    children: React.ReactNode;
    /** Optional title for the header bar */
    title?: string;
    /** Optional icon element for the header */
    icon?: React.ReactNode;
    /** Size variant affecting padding */
    size?: HudFrameSize;
    /** Color variant for alert states */
    variant?: HudFrameVariant;
    /** Loading state */
    isLoading?: boolean;
    /** Hide the header bar entirely */
    hideHeader?: boolean;
    /** Hide corner reticle decorations */
    hideReticles?: boolean;
    /** Optional className for additional styling */
    className?: string;
    /** Optional inline styles */
    style?: React.CSSProperties;
    /** Optional aria-label for accessibility */
    'aria-label'?: string;
}
export declare const HudFrame: React.NamedExoticComponent<HudFrameProps>;
export default HudFrame;
//# sourceMappingURL=HudFrame.d.ts.map