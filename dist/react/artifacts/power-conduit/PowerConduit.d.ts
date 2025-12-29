/**
 * PowerConduit Artifact Component
 * A cyberpunk energy conduit progress bar with segmented power cells
 * Designed as a physical power gauge, not a styled rectangle
 */
import './power-conduit.base.css';
import './power-conduit.cyberpunk.css';
export interface PowerConduitProps {
    /** Current value */
    value: number;
    /** Maximum value */
    max: number;
    /** Label describing the metric */
    label: string;
    /** Visual variant */
    variant?: 'default' | 'warning' | 'critical';
    /** Number of segments (power cells) */
    segments?: number;
    /** Optional className for additional styling */
    className?: string;
}
export declare function PowerConduit({ value, max, label, variant, segments, className, }: PowerConduitProps): import("react/jsx-runtime").JSX.Element;
export default PowerConduit;
//# sourceMappingURL=PowerConduit.d.ts.map