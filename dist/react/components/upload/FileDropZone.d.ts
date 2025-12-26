/**
 * FileDropZone - Drag and drop area for file uploads
 */
import React from 'react';
export interface FileDropZoneProps {
    onFilesSelected: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    className?: string;
}
export declare function FileDropZone({ onFilesSelected, accept, multiple, disabled, className, }: FileDropZoneProps): React.ReactElement;
//# sourceMappingURL=FileDropZone.d.ts.map