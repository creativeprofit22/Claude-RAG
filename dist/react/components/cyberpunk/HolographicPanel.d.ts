/**
 * HolographicPanel - Damaged holographic display mesh
 *
 * A 3D panel with shader-based damage effects, scan lines, and flickering.
 * The main visual element of the cyberpunk terminal.
 */
interface HolographicPanelProps {
    width?: number;
    height?: number;
    depth?: number;
    damageIntensity?: number;
    glitchIntensity?: number;
    scanlineIntensity?: number;
    flickerIntensity?: number;
    opacity?: number;
}
export declare function HolographicPanel({ width, height, depth, damageIntensity, glitchIntensity, scanlineIntensity, flickerIntensity, opacity, }: HolographicPanelProps): import("react/jsx-runtime").JSX.Element;
export default HolographicPanel;
//# sourceMappingURL=HolographicPanel.d.ts.map