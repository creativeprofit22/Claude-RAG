'use client';

import { useEffect, useCallback } from 'react';

interface UseModalOptions {
  /** Callback when modal should close */
  onClose: () => void;
}

interface UseModalReturn {
  /** Handler for backdrop clicks - closes on click outside modal content */
  handleBackdropClick: (e: React.MouseEvent) => void;
}

/**
 * Hook for common modal behavior:
 * - ESC key to close
 * - Body scroll lock while open
 * - Backdrop click detection
 */
export function useModal({ onClose }: UseModalOptions): UseModalReturn {
  // Handle ESC key to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, { passive: true });
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  // Handle backdrop click (close if clicked on backdrop, not modal content)
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  return { handleBackdropClick };
}
