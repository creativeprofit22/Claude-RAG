interface TypingIndicatorProps {
    accentColor?: string;
    /** Optional: force processing state (uses InkSwirl instead of InkDrop) */
    isProcessing?: boolean;
}
/**
 * TypingIndicator - Shows loading state in the chat
 *
 * For library skin: Uses InkDrop (ink dropping from pen nib)
 * For other skins: Uses original LoadingDots animation
 */
export declare function TypingIndicator({ accentColor, isProcessing, }: TypingIndicatorProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=TypingIndicator.d.ts.map