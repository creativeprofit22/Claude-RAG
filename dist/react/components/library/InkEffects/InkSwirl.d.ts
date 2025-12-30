/**
 * InkSwirl Component
 * Library Skin V2: Typewriter Edition
 *
 * Processing state indicator showing ink swirling in an inkwell.
 * Contained, cyclical animation for ongoing operations.
 *
 * Tech stack: React + GSAP + SVG Filters
 */
import './InkEffects.css';
export interface InkSwirlProps {
    /** Whether the swirl animation is active */
    active: boolean;
    /** Size in pixels (default: 64) */
    size?: number;
    /** Additional CSS class */
    className?: string;
    /** Accessible label for screen readers */
    ariaLabel?: string;
}
/**
 * InkSwirl - A processing indicator styled as ink swirling in an inkwell.
 *
 * The animation shows:
 * 1. Brass-rimmed inkwell container
 * 2. Dark ink surface with wet sheen
 * 3. Spiral pattern continuously rotating
 * 4. Subtle organic distortion via SVG filter
 *
 * @example
 * ```tsx
 * <InkSwirl active={isProcessing} size={48} />
 * ```
 */
export declare function InkSwirl({ active, size, className, ariaLabel, }: InkSwirlProps): import("react/jsx-runtime").JSX.Element | null;
export default InkSwirl;
//# sourceMappingURL=InkSwirl.d.ts.map