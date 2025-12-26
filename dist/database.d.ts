/**
 * Database module for RAG system
 * Uses LanceDB for vector storage and similarity search
 */
import { type Table } from '@lancedb/lancedb';
/**
 * Summary of a document (aggregated from chunks)
 */
export interface DocumentSummary {
    documentId: string;
    documentName: string;
    chunkCount: number;
    timestamp: number;
    source?: string;
    type?: string;
}
/**
 * Detailed document info including chunk previews
 */
export interface DocumentDetails extends DocumentSummary {
    chunks: Array<{
        chunkIndex: number;
        snippet: string;
    }>;
}
/**
 * Metadata associated with each document chunk
 */
export interface DocumentMetadata {
    documentId: string;
    documentName: string;
    chunkIndex: number;
    timestamp: number;
    [key: string]: string | number | boolean | undefined;
}
/**
 * A document with its vector embedding stored in the database
 */
export interface VectorDocument {
    id: string;
    vector: number[];
    text: string;
    metadata: DocumentMetadata;
    [key: string]: string | number | number[] | DocumentMetadata | undefined;
}
/**
 * Search result with distance score
 */
export interface SearchResult extends VectorDocument {
    _distance?: number;
}
/**
 * Options for database operations
 */
export interface SearchOptions {
    limit?: number;
    filter?: string;
}
/**
 * RAG Database class for managing vector storage
 */
declare class RAGDatabase {
    private db;
    private table;
    private dbPath;
    constructor(dbPath?: string);
    /**
     * Execute a callback with the table, returning fallback if table doesn't exist.
     * Note: Errors are logged but not thrown to maintain backward compatibility.
     * Consider using try-catch in caller if you need error handling.
     */
    private withTable;
    /**
     * Paginate through all rows in a table, processing each row with a callback.
     * Handles batching and offset logic internally.
     */
    private paginateTable;
    /**
     * Connect to the LanceDB database
     */
    connect(): Promise<void>;
    /**
     * Ensure the documents table exists and return it
     */
    ensureTable(): Promise<Table | null>;
    /**
     * Add documents to the vector database
     */
    addDocuments(docs: VectorDocument[]): Promise<void>;
    /**
     * Search for similar documents using vector similarity
     */
    search(queryVector: number[], options?: SearchOptions): Promise<SearchResult[]>;
    /**
     * List all unique document IDs in the database
     * Uses pagination to handle large datasets
     */
    listDocuments(): Promise<string[]>;
    /**
     * Get all chunks for a specific document
     * @param documentId - The document ID to fetch chunks for
     * @param limit - Maximum chunks to return (default: 10000)
     */
    getDocumentChunks(documentId: string, limit?: number): Promise<VectorDocument[]>;
    /**
     * Delete all chunks for a specific document
     */
    deleteDocument(documentId: string): Promise<void>;
    /**
     * Delete all documents from the database
     */
    deleteAll(): Promise<void>;
    /**
     * Get the total number of chunks in the database
     */
    getChunkCount(): Promise<number>;
    /**
     * Check if the database has data
     */
    hasData(): Promise<boolean>;
    /**
     * Get database statistics
     */
    getStats(): Promise<{
        documentCount: number;
        chunkCount: number;
        tableExists: boolean;
    }>;
    /**
     * Get summary of all documents (aggregated by documentId)
     * Uses pagination to handle large datasets
     */
    getDocumentSummaries(): Promise<DocumentSummary[]>;
    /**
     * Get detailed info for a single document including chunk previews
     * @param documentId - The document ID to fetch details for
     * @param limit - Maximum chunks to include (default: 10000)
     */
    getDocumentDetails(documentId: string, limit?: number): Promise<DocumentDetails | null>;
}
export declare const ragDatabase: RAGDatabase;
export { RAGDatabase };
//# sourceMappingURL=database.d.ts.map