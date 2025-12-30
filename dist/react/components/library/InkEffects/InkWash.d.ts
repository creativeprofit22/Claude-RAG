/**
 * InkWash Component
 * Library Skin V2: Typewriter Edition
 *
 * Page transition effect using ink wash wipe animation.
 * Floods in from one side, then recedes to reveal new content.
 *
 * Tech stack: React + GSAP + SVG Filters
 */
import { ReactNode } from 'react';
import './InkEffects.css';
export interface InkWashProps {
    /** Content to wrap with transition effect */
    children: ReactNode;
    /** Whether to trigger the wash animation */
    trigger: boolean;
    /** Animation direction */
    direction?: 'in' | 'out';
    /** Callback when transition completes */
    onComplete?: () => void;
    /** Duration in milliseconds (default: 1200) */
    duration?: number;
    /** Additional CSS class */
    className?: string;
}
/**
 * InkWash - A page transition component using ink wash wipe effect.
 *
 * The animation shows:
 * 1. Ink floods in from the left with organic edge
 * 2. Covers the entire viewport momentarily
 * 3. Recedes to the right, revealing content beneath
 *
 * Use 'in' direction when entering a new page/state
 * Use 'out' direction when leaving current page/state
 *
 * @example
 * ```tsx
 * <InkWash trigger={isTransitioning} direction="in" onComplete={handleComplete}>
 *   <PageContent />
 * </InkWash>
 * ```
 */
export declare function InkWash({ children, trigger, direction, onComplete, duration, className, }: InkWashProps): import("react/jsx-runtime").JSX.Element;
/**
 * useInkWash - Hook for controlling ink wash transitions
 *
 * @example
 * ```tsx
 * const { triggerWash, isWashing, reset } = useInkWash();
 *
 * const handleNavigate = async () => {
 *   triggerWash('in');
 *   await loadNewPage();
 *   reset();
 * };
 * ```
 */
export declare function useInkWash(): {
    trigger: boolean;
    direction: "in" | "out";
    isWashing: boolean;
    triggerWash: (direction?: "in" | "out") => void;
    reset: () => void;
};
export default InkWash;
//# sourceMappingURL=InkWash.d.ts.map