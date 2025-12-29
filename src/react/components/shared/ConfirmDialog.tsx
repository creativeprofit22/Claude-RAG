'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { useModal } from '../../hooks/useModal.js';
import { useSkinMotion } from '../../motion/hooks/useSkinMotion.js';

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
  const { motion: skinMotion } = useSkinMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="curator-overlay rag-confirm-overlay"
        onClick={handleBackdropClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <motion.div
          className="rag-confirm-dialog"
          variants={skinMotion.modal}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
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
            className="curator-btn curator-btn-icon rag-confirm-close"
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
            className="curator-btn curator-btn-ghost rag-confirm-btn rag-confirm-btn-cancel"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`curator-btn rag-confirm-btn ${
              isDestructive ? 'curator-btn-danger rag-confirm-btn-destructive' : 'curator-btn-primary rag-confirm-btn-confirm'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
