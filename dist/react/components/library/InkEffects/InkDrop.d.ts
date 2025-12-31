/**
 * InkDrop Component
 * Library Skin V2: Typewriter Edition
 *
 * Loading state indicator that simulates ink dropping from an inkwell
 * and spreading organically on paper.
 *
 * Tech stack: React + GSAP + SVG Filters
 */
import './InkEffects.css';
export interface InkDropProps {
    /** Whether the loading animation is active */
    active: boolean;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Additional CSS class */
    className?: string;
    /** Accessible label for screen readers */
    ariaLabel?: string;
}
/**
 * InkDrop - A loading indicator styled as ink dropping from an inkwell.
 *
 * The animation shows:
 * 1. Ink forming at the inkwell opening
 * 2. Drop falling organically
 * 3. Spreading into a puddle on impact
 * 4. Puddle fading as ink absorbs into paper
 *
 * @example
 * ```tsx
 * <InkDrop active={isLoading} size="md" />
 * ```
 */
export declare function InkDrop({ active, size, className, ariaLabel, }: InkDropProps): import("react/jsx-runtime").JSX.Element | null;
export default InkDrop;
//# sourceMappingURL=InkDrop.d.ts.map