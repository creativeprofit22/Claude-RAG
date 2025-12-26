import { FileText, FileCode, FileJson, File } from 'lucide-react';
/**
 * Get the appropriate icon for a document type
 * Centralized icon mapping for document types
 */
export function getDocumentIcon(type) {
    switch (type?.toLowerCase()) {
        case 'markdown':
        case 'md':
            return FileText;
        case 'code':
        case 'typescript':
        case 'javascript':
        case 'python':
        case 'ts':
        case 'tsx':
        case 'js':
        case 'jsx':
        case 'py':
            return FileCode;
        case 'json':
            return FileJson;
        default:
            return File;
    }
}
//# sourceMappingURL=documentIcons.js.map