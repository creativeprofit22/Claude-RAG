export interface ErrorBannerProps {
    /** Error message to display */
    error: string;
    /** Callback when dismiss button is clicked */
    onDismiss: () => void;
}
/**
 * ErrorBanner - Dismissible error alert banner
 *
 * For library skin: Uses InkBlot with ink spreading animation
 * For other skins: Uses curator-error-banner styling
 *
 * @example
 * ```tsx
 * {error && <ErrorBanner error={error} onDismiss={() => setError(null)} />}
 * ```
 */
export declare function ErrorBanner({ error, onDismiss }: ErrorBannerProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ErrorBanner.d.ts.map