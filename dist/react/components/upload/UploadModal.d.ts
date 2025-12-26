/**
 * UploadModal - Enhanced upload modal with file queue and category selection
 */
import React from 'react';
import { type QueuedFile } from '../../hooks/useFileQueue.js';
export interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadComplete?: (files: QueuedFile[]) => void;
    endpoint?: string;
    headers?: Record<string, string>;
    className?: string;
}
export declare function UploadModal({ isOpen, onClose, onUploadComplete, endpoint, headers, className, }: UploadModalProps): React.ReactElement | null;
//# sourceMappingURL=UploadModal.d.ts.map