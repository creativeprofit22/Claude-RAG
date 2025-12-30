/**
 * InkBlot Component
 * Library Skin V2: Typewriter Edition
 *
 * Error state indicator that displays a spreading ink blot,
 * with blotting paper absorption for recoverable error feel.
 *
 * Tech stack: React + GSAP + SVG Filters
 */
import './InkEffects.css';
export interface InkBlotProps {
    /** Error message to display */
    message?: string;
    /** Callback when error is dismissed */
    onDismiss?: () => void;
    /** Whether to show the dismiss button */
    showDismiss?: boolean;
    /** Additional CSS class */
    className?: string;
    /** Auto-dismiss after duration (ms), 0 = no auto-dismiss */
    autoDismissAfter?: number;
}
/**
 * InkBlot - An error state indicator styled as a spreading ink blot.
 *
 * The animation shows:
 * 1. Ink blot appears and spreads organically
 * 2. Small splatter drops appear around the main blot
 * 3. Blot slowly morphs (breathing effect)
 * 4. On dismiss: blotting paper overlay absorbs the ink
 *
 * @example
 * ```tsx
 * <InkBlot
 *   message="Something went wrong"
 *   onDismiss={() => clearError()}
 * />
 * ```
 */
export declare function InkBlot({ message, onDismiss, showDismiss, className, autoDismissAfter, }: InkBlotProps): import("react/jsx-runtime").JSX.Element;
export default InkBlot;
//# sourceMappingURL=InkBlot.d.ts.map