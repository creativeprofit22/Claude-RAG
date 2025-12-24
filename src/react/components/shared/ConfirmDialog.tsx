'use client';

import { AlertTriangle, X } from 'lucide-react';
import { useModal } from '../../hooks/useModal.js';

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
export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = false,
}: ConfirmDialogProps) {
  const { handleBackdropClick } = useModal({ onClose: onCancel });

  return (
    <div
      className="rag-confirm-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="rag-confirm-dialog">
        {/* Header */}
        <div className="rag-confirm-header">
          <div className="rag-confirm-title-row">
            {isDestructive && (
              <div className="rag-confirm-icon rag-confirm-icon-destructive">
                <AlertTriangle size={20} aria-hidden="true" />
              </div>
            )}
            <h3 id="confirm-dialog-title" className="rag-confirm-title">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rag-confirm-close"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Message */}
        <div className="rag-confirm-body">
          <p className="rag-confirm-message">{message}</p>
        </div>

        {/* Actions */}
        <div className="rag-confirm-actions">
          <button
            type="button"
            onClick={onCancel}
            className="rag-confirm-btn rag-confirm-btn-cancel"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rag-confirm-btn ${
              isDestructive ? 'rag-confirm-btn-destructive' : 'rag-confirm-btn-confirm'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
