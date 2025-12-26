/**
 * Database module for RAG system
 * Uses LanceDB for vector storage and similarity search
 */

import { connect, type Connection, type Table } from '@lancedb/lancedb';
import { join } from 'path';

const DB_PATH = process.env.RAG_DB_PATH || join(process.cwd(), 'data', 'vectors');
const TABLE_NAME = 'documents';
/**
 * Default maximum chunks to fetch per document query.
 * Set high (10K) to ensure all chunks are returned for most documents.
 * Typical documents have 10-500 chunks; 10K accommodates very large docs
 * (e.g., 2000-page PDFs) while preventing unbounded memory usage.
 */
const DEFAULT_CHUNK_LIMIT = 10000;

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
  chunks: Array<{ chunkIndex: number; snippet: string }>;
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
 * Validate document ID format to prevent injection attacks
 * Only allows alphanumeric characters, underscores, and hyphens
 */
function validateDocumentId(documentId: string): void {
  if (!/^[a-zA-Z0-9_-]+$/.test(documentId)) {
    throw new Error('Invalid document ID format: must contain only alphanumeric characters, underscores, and hyphens');
  }
}

/**
 * Escape a string value for use in LanceDB WHERE clause
 * Prevents SQL injection by escaping special characters
 */
function escapeFilterValue(value: unknown): string {
  // Type validation - ensure we have a string
  if (typeof value !== 'string') {
    throw new Error('Filter value must be a string');
  }
  // Escape backslashes first, then double quotes
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/**
 * Cast LanceDB query results to VectorDocument array.
 * LanceDB returns untyped rows, this provides a single cast point.
 */
function toVectorDocuments(results: unknown[]): VectorDocument[] {
  return results as unknown as VectorDocument[];
}

/**
 * Cast LanceDB search results to SearchResult array.
 * SearchResult extends VectorDocument with optional _distance field.
 */
function toSearchResults(results: unknown[]): SearchResult[] {
  return results as unknown as SearchResult[];
}

/**
 * Execute a database operation with automatic retry on table already exists error.
 * Handles race condition where another process creates the table between check and create.
 */
async function withTableRaceRetry<T>(
  operation: () => Promise<T>,
  retryOperation: () => Promise<T>
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      return await retryOperation();
    }
    throw error;
  }
}

/**
 * RAG Database class for managing vector storage
 */
class RAGDatabase {
  private db: Connection | null = null;
  private table: Table | null = null;
  private dbPath: string;

  constructor(dbPath: string = DB_PATH) {
    this.dbPath = dbPath;
  }

  /**
   * Execute a callback with the table, returning fallback if table doesn't exist.
   * Note: Errors are logged but not thrown to maintain backward compatibility.
   * Consider using try-catch in caller if you need error handling.
   */
  private async withTable<T>(fallback: T, callback: (table: Table) => Promise<T>): Promise<T> {
    const table = await this.ensureTable();
    if (!table) {
      console.warn('[RAGDatabase] Table not available, returning fallback');
      return fallback;
    }
    try {
      return await callback(table);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('[RAGDatabase] Error in table operation:', { error: errorMsg, fallbackReturned: true });
      return fallback;
    }
  }

  /**
   * Paginate through all rows in a table, processing each row with a callback.
   * Handles batching and offset logic internally.
   */
  private async paginateTable(
    table: Table,
    processRow: (doc: VectorDocument) => void,
    batchSize: number = 5000
  ): Promise<void> {
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      try {
        const batch = await table.query().limit(batchSize).offset(offset).toArray();
        const docs = toVectorDocuments(batch);

        for (const doc of docs) {
          processRow(doc);
        }

        hasMore = batch.length === batchSize;
        offset += batchSize;
      } catch (error) {
        console.error('[RAGDatabase] Error in pagination batch:', { offset, batchSize, error });
        // Re-throw to let caller handle the error appropriately
        throw error;
      }
    }
  }

  /**
   * Connect to the LanceDB database
   */
  async connect(): Promise<void> {
    if (!this.db) {
      this.db = await connect(this.dbPath);
    }
  }

  /**
   * Ensure the documents table exists and return it
   */
  async ensureTable(): Promise<Table | null> {
    await this.connect();

    // Verify connection succeeded before accessing db
    if (!this.db) {
      console.error('[RAGDatabase] Database connection is null after connect()');
      return null;
    }

    if (!this.table) {
      const tables = await this.db.tableNames();
      if (tables.includes(TABLE_NAME)) {
        this.table = await this.db.openTable(TABLE_NAME);
      }
    }

    return this.table;
  }

  /**
   * Add documents to the vector database
   */
  async addDocuments(docs: VectorDocument[]): Promise<void> {
    if (!docs || docs.length === 0) {
      throw new Error('Documents array cannot be empty');
    }

    // Validate documents
    for (const doc of docs) {
      if (!doc.id || !doc.vector || !doc.text || !doc.metadata) {
        throw new Error('Invalid document: missing required fields');
      }
      if (!Array.isArray(doc.vector) || doc.vector.length === 0) {
        throw new Error('Invalid document: vector must be a non-empty array');
      }
    }

    await this.connect();

    // Verify connection succeeded
    if (!this.db) {
      throw new Error('Database connection failed');
    }

    // Handle race condition between tableNames() check and openTable()
    // Another process could create the table between our check and createTable call
    const db = this.db;
    this.table = await withTableRaceRetry(
      async () => {
        const tables = await db.tableNames();
        if (tables.includes(TABLE_NAME)) {
          const table = await db.openTable(TABLE_NAME);
          await table.add(docs);
          return table;
        } else {
          return await db.createTable(TABLE_NAME, docs);
        }
      },
      async () => {
        const table = await db.openTable(TABLE_NAME);
        await table.add(docs);
        return table;
      }
    );
  }

  /**
   * Search for similar documents using vector similarity
   */
  async search(
    queryVector: number[],
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    // Validate and clamp limit to reasonable bounds (1-1000)
    const rawLimit = options.limit ?? 5;
    const limit = Math.max(1, Math.min(1000, rawLimit));
    const { filter } = options;

    if (!Array.isArray(queryVector) || queryVector.length === 0) {
      throw new Error('Query vector must be a non-empty array');
    }

    const table = await this.ensureTable();
    if (!table) {
      return [];
    }

    let query = table.vectorSearch(queryVector).limit(limit);

    if (filter) {
      query = query.where(filter);
    }

    const results = await query.toArray();
    return toSearchResults(results);
  }

  /**
   * List all unique document IDs in the database
   * Uses pagination to handle large datasets
   */
  async listDocuments(): Promise<string[]> {
    return this.withTable([], async (table) => {
      const docIds = new Set<string>();

      await this.paginateTable(table, (doc) => {
        if (doc.metadata?.documentId) {
          docIds.add(doc.metadata.documentId);
        }
      });

      return Array.from(docIds);
    });
  }

  /**
   * Get all chunks for a specific document
   * @param documentId - The document ID to fetch chunks for
   * @param limit - Maximum chunks to return (default: 10000)
   */
  async getDocumentChunks(documentId: string, limit: number = DEFAULT_CHUNK_LIMIT): Promise<VectorDocument[]> {
    // Validate documentId format to prevent injection
    validateDocumentId(documentId);

    return this.withTable([], async (table) => {
      const results = await table
        .query()
        .where(`metadata.documentId = "${escapeFilterValue(documentId)}"`)
        .limit(limit)
        .toArray();

      return toVectorDocuments(results);
    });
  }

  /**
   * Delete all chunks for a specific document
   */
  async deleteDocument(documentId: string): Promise<void> {
    if (!documentId) {
      throw new Error('Document ID is required');
    }

    // Validate documentId format to prevent injection
    validateDocumentId(documentId);

    const table = await this.ensureTable();
    if (!table) {
      return;
    }

    await table.delete(`metadata.documentId = "${escapeFilterValue(documentId)}"`);
  }

  /**
   * Delete all documents from the database
   */
  async deleteAll(): Promise<void> {
    await this.connect();

    const tables = await this.db!.tableNames();
    if (tables.includes(TABLE_NAME)) {
      await this.db!.dropTable(TABLE_NAME);
      this.table = null;
    }
  }

  /**
   * Get the total number of chunks in the database
   */
  async getChunkCount(): Promise<number> {
    return this.withTable(0, async (table) => {
      return await table.countRows();
    });
  }

  /**
   * Check if the database has data
   */
  async hasData(): Promise<boolean> {
    const table = await this.ensureTable();
    return table !== null;
  }

  /**
   * Get database statistics
   */
  async getStats(): Promise<{
    documentCount: number;
    chunkCount: number;
    tableExists: boolean;
  }> {
    const table = await this.ensureTable();
    if (!table) {
      return {
        documentCount: 0,
        chunkCount: 0,
        tableExists: false,
      };
    }

    const documents = await this.listDocuments();
    const chunkCount = await this.getChunkCount();

    return {
      documentCount: documents.length,
      chunkCount,
      tableExists: true,
    };
  }

  /**
   * Get summary of all documents (aggregated by documentId)
   * Uses pagination to handle large datasets
   */
  async getDocumentSummaries(): Promise<DocumentSummary[]> {
    return this.withTable([], async (table) => {
      const docMap = new Map<string, {
        documentName: string;
        chunkCount: number;
        timestamp: number;
        source?: string;
        type?: string;
      }>();

      await this.paginateTable(table, (doc) => {
        // Validate doc and metadata exist before accessing properties
        if (!doc || !doc.metadata || !doc.metadata.documentId) return;

        // Validate documentName is a non-empty string
        const documentName = typeof doc.metadata.documentName === 'string' && doc.metadata.documentName.trim()
          ? doc.metadata.documentName
          : 'Unknown';

        const existing = docMap.get(doc.metadata.documentId);
        if (existing) {
          existing.chunkCount++;
        } else {
          docMap.set(doc.metadata.documentId, {
            documentName,
            chunkCount: 1,
            timestamp: doc.metadata.timestamp || Date.now(),
            source: doc.metadata.source as string | undefined,
            type: doc.metadata.type as string | undefined,
          });
        }
      });

      return Array.from(docMap.entries()).map(([documentId, data]) => ({
        documentId,
        ...data,
      }));
    });
  }

  /**
   * Get detailed info for a single document including chunk previews
   * @param documentId - The document ID to fetch details for
   * @param limit - Maximum chunks to include (default: 10000)
   */
  async getDocumentDetails(documentId: string, limit: number = DEFAULT_CHUNK_LIMIT): Promise<DocumentDetails | null> {
    return this.withTable(null, async (table) => {
      const results = await table
        .query()
        .where(`metadata.documentId = "${escapeFilterValue(documentId)}"`)
        .limit(limit)
        .toArray();

      if (results.length === 0) {
        return null;
      }

      const docs = toVectorDocuments(results);
      const firstDoc = docs[0];

      // Sort chunks by chunkIndex (copy to avoid mutating query results)
      const sortedDocs = [...docs].sort((a, b) => a.metadata.chunkIndex - b.metadata.chunkIndex);

      return {
        documentId,
        documentName: firstDoc.metadata.documentName,
        chunkCount: docs.length,
        timestamp: firstDoc.metadata.timestamp,
        source: firstDoc.metadata.source as string | undefined,
        type: firstDoc.metadata.type as string | undefined,
        chunks: sortedDocs.map((doc) => ({
          chunkIndex: doc.metadata.chunkIndex,
          snippet: doc.text.slice(0, 200),
        })),
      };
    });
  }
}

// Export a singleton instance
export const ragDatabase = new RAGDatabase();

// Export the class for custom instances
export { RAGDatabase };
