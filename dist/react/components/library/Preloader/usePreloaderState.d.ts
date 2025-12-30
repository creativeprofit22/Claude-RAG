/**
 * usePreloaderState Hook
 * Library Skin V2: "The Library Opens" Sequence
 *
 * Manages preloader visibility logic:
 * - localStorage flag for auto-skip after first view
 * - prefers-reduced-motion detection
 * - Skip functionality
 */
interface UsePreloaderStateOptions {
    /** Force show preloader regardless of localStorage */
    forceShow?: boolean;
}
interface UsePreloaderStateReturn {
    /** Whether preloader should be displayed */
    shouldShow: boolean;
    /** Whether user has seen preloader before */
    hasSeenBefore: boolean;
    /** Whether user prefers reduced motion */
    prefersReducedMotion: boolean;
    /** Mark preloader as seen (sets localStorage flag) */
    markAsSeen: () => void;
    /** Skip remaining animation and complete */
    skipToEnd: () => void;
    /** Whether skip was triggered */
    wasSkipped: boolean;
}
export declare function usePreloaderState(options?: UsePreloaderStateOptions): UsePreloaderStateReturn;
export {};
//# sourceMappingURL=usePreloaderState.d.ts.map