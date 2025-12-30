'use client';

import { AlertCircle, X } from 'lucide-react';
import { useSkinDetect } from '../../motion/hooks/useSkinDetect.js';
import { InkBlot } from '../library/InkEffects/InkBlot.js';

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
export function ErrorBanner({ error, onDismiss }: ErrorBannerProps) {
  const skin = useSkinDetect();

  // Library skin: Use InkBlot error display
  if (skin === 'library') {
    return (
      <div className="rag-error-banner rag-error-banner--library">
        <InkBlot
          message={error}
          onDismiss={onDismiss}
          showDismiss={true}
          autoDismissAfter={0}
        />
      </div>
    );
  }

  // Default skin: Use standard error banner
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
