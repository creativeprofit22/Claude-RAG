/**
 * FileManifest Artifact Component
 * A corrupted thermal printer receipt with physical wear and data degradation
 *
 * Design: "Corrupted Data Terminal Printout"
 * - Tapered/angled top edge (torn from printer)
 * - Perforated tear line at bottom
 * - Feed holes on left side (dot matrix printer paper)
 * - Physical wear/aging effects
 * - Two-row entry layout: filename + time, then metadata
 */
import './file-manifest.base.css';
import './file-manifest.cyberpunk.css';
export interface FileEntry {
    /** Unique document identifier */
    documentId: string;
    /** Display name of the document */
    documentName: string;
    /** Unix timestamp of upload */
    timestamp: number;
    /** Number of chunks the document was split into */
    chunkCount: number;
}
export interface FileManifestProps {
    /** Array of file entries to display */
    files: FileEntry[];
    /** Sector label displayed in header */
    sectorLabel?: string;
    /** Corruption level 0-100 affecting visual degradation */
    corruptionLevel?: number;
    /** Loading state */
    isLoading?: boolean;
    /** Optional className for additional styling */
    className?: string;
}
export declare function FileManifest({ files, sectorLabel, corruptionLevel, isLoading, className, }: FileManifestProps): import("react/jsx-runtime").JSX.Element;
export default FileManifest;
//# sourceMappingURL=FileManifest.d.ts.map