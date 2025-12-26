interface UseModalOptions {
    /** Callback when modal should close */
    onClose: () => void;
    /** Whether the modal is currently open (controls scroll lock) */
    isOpen?: boolean;
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
export declare function useModal({ onClose, isOpen }: UseModalOptions): UseModalReturn;
export {};
//# sourceMappingURL=useModal.d.ts.map