/**
 * FileQueue - Display and manage queued files for upload
 */
import React from 'react';
import type { QueuedFile } from '../../hooks/useFileQueue.js';
export interface FileQueueProps {
    files: QueuedFile[];
    onRemove: (id: string) => void;
    onRename?: (id: string, name: string) => void;
    isUploading?: boolean;
    className?: string;
}
export declare function FileQueue({ files, onRemove, onRename, isUploading, className, }: FileQueueProps): React.ReactElement | null;
//# sourceMappingURL=FileQueue.d.ts.map