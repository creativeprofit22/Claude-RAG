export interface ConfirmDialogProps {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDestructive?: boolean;
}
/**
 * ConfirmDialog - Simple confirmation modal for destructive actions
 */
export declare function ConfirmDialog({ title, message, confirmLabel, cancelLabel, onConfirm, onCancel, isDestructive, }: ConfirmDialogProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ConfirmDialog.d.ts.map