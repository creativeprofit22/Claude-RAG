import { type DocumentSummary } from './types.js';
export type RAGInterfaceView = 'chat' | 'documents';
export interface RAGInterfaceProps {
    /** API endpoint base URL (default: /api/rag) */
    endpoint?: string;
    /** Custom headers for API requests */
    headers?: Record<string, string>;
    /** Chat title */
    chatTitle?: string;
    /** Documents title */
    documentsTitle?: string;
    /** Accent color for interactive elements */
    accentColor?: string;
    /** Initial view to show */
    defaultView?: RAGInterfaceView;
    /** Show document library tab */
    showDocumentLibrary?: boolean;
    /** Chat placeholder text */
    placeholder?: string;
    /** Show source citations */
    showSources?: boolean;
    /** System prompt for chat */
    systemPrompt?: string;
    /** Number of chunks to retrieve */
    topK?: number;
    /** Override responder (claude or gemini) */
    responder?: 'claude' | 'gemini';
    /** Additional CSS class */
    className?: string;
    /** Callback when document is selected for querying */
    onDocumentSelect?: (doc: DocumentSummary | null) => void;
    /** Custom empty state for chat */
    chatEmptyState?: React.ReactNode;
    /** Custom empty state for documents */
    documentsEmptyState?: React.ReactNode;
    /** Show preloader animation for library skin (default: true) */
    showPreloader?: boolean;
    /** Custom welcome text for preloader (default: "Welcome to the Library...") */
    preloaderWelcomeText?: string;
    /** Enable preloader sound effects (default: true) */
    preloaderSoundEnabled?: boolean;
}
/**
 * RAGInterface - Unified chat and document library interface
 *
 * Provides tab navigation between Chat and Documents views with document scoping.
 * When a document is selected from the library, queries are filtered to that document.
 *
 * @example
 * ```tsx
 * import { RAGInterface } from 'claude-rag/react';
 * import 'claude-rag/react/styles.css';
 *
 * <RAGInterface
 *   endpoint="/api/rag"
 *   chatTitle="Document Assistant"
 *   accentColor="#10b981"
 * />
 * ```
 */
export declare function RAGInterface({ endpoint, headers, chatTitle, documentsTitle, accentColor, defaultView, showDocumentLibrary, placeholder, showSources, systemPrompt, topK, responder, className, onDocumentSelect, chatEmptyState, documentsEmptyState, showPreloader, preloaderWelcomeText, preloaderSoundEnabled, }: RAGInterfaceProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=RAGInterface.d.ts.map