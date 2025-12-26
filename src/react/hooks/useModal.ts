'use client';

import { useEffect, useCallback, useRef } from 'react';

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
  // Use ref for onClose to avoid event listener re-registration on every render
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    // Use a stable handler that reads from ref to avoid event listener accumulation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
      }
    };

    // passive: true signals we won't call preventDefault(), allowing browser
    // optimizations. Safe for ESC handling since we only close the modal,
    // we don't need to prevent default ESC behavior (there isn't any).
    document.addEventListener('keydown', handleKeyDown, { passive: true });
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, []); // Empty deps - handler is stable via ref

  // Handle backdrop click (close if clicked on backdrop, not modal content)
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onCloseRef.current();
      }
    },
    []
  );

  return { handleBackdropClick };
}
