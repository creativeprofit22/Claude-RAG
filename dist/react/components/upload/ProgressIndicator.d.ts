/**
 * ProgressIndicator - Staged progress display for file uploads
 */
import React from 'react';
import type { UploadProgress } from '../../hooks/useUploadStream.js';
export interface ProgressIndicatorProps {
    progress: UploadProgress;
    showStages?: boolean;
    className?: string;
}
export declare function ProgressIndicator({ progress, showStages, className, }: ProgressIndicatorProps): React.ReactElement;
//# sourceMappingURL=ProgressIndicator.d.ts.map