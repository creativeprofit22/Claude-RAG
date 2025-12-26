/**
 * FilePreview - Preview of file content with chunk estimation
 */
import React from 'react';
export interface FilePreviewProps {
    file: File;
    preview?: string;
    estimatedChunks?: number;
    maxPreviewLength?: number;
    className?: string;
    estimateEndpoint?: string;
    onEstimate?: (estimate: {
        wordCount: number;
        estimatedChunks: number;
    }) => void;
}
export declare function FilePreview({ file, preview, estimatedChunks, maxPreviewLength, className, estimateEndpoint, onEstimate, }: FilePreviewProps): React.ReactElement;
//# sourceMappingURL=FilePreview.d.ts.map