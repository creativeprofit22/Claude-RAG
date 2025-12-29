'use client';

import { AlertCircle, X } from 'lucide-react';

export interface ErrorBannerProps {
  /** Error message to display */
  error: string;
  /** Callback when dismiss button is clicked */
  onDismiss: () => void;
}

/**
 * ErrorBanner - Dismissible error alert banner
 *
 * Uses curator-error-banner styling.
 *
 * @example
 * ```tsx
 * {error && <ErrorBanner error={error} onDismiss={() => setError(null)} />}
 * ```
 */
export function ErrorBanner({ error, onDismiss }: ErrorBannerProps) {
  return (
    <div className="curator-error-banner" role="alert">
      <AlertCircle size={16} aria-hidden="true" />
      <span>{error}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="curator-error-dismiss"
        aria-label="Dismiss error"
      >
        <X size={14} />
      </button>
    </div>
  );
}
