/**
 * Database module for RAG system
 * Uses LanceDB for vector storage and similarity search
 */

import { connect, type Connection, type Table } from '@lancedb/lancedb';
import { join } from 'path';

const DB_PATH = process.env.RAG_DB_PATH || join(process.cwd(), 'data', 'vectors');
const TABLE_NAME = 'documents';

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
class RAGDatabase {
  private db: Connection | null = null;
  private table: Table | null = null;
  private dbPath: string;

  constructor(dbPath: string = DB_PATH) {
    this.dbPath = dbPath;
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

    if (!this.table) {
      const tables = await this.db!.tableNames();
      if (tables.includes(TABLE_NAME)) {
        this.table = await this.db!.openTable(TABLE_NAME);
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

    const tables = await this.db!.tableNames();
    if (tables.includes(TABLE_NAME)) {
      const table = await this.db!.openTable(TABLE_NAME);
      await table.add(docs);
      this.table = table;
    } else {
      this.table = await this.db!.createTable(TABLE_NAME, docs);
    }
  }

  /**
   * Search for similar documents using vector similarity
   */
  async search(
    queryVector: number[],
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    const { limit = 5, filter } = options;

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
    return results as unknown as SearchResult[];
  }

  /**
   * List all unique document IDs in the database
   */
  async listDocuments(): Promise<string[]> {
    const table = await this.ensureTable();
    if (!table) {
      return [];
    }

    try {
      const all = await table.query().limit(10000).toArray();
      const docIds = new Set<string>();

      for (const row of all) {
        const doc = row as unknown as VectorDocument;
        if (doc.metadata?.documentId) {
          docIds.add(doc.metadata.documentId);
        }
      }

      return Array.from(docIds);
    } catch {
      return [];
    }
  }

  /**
   * Get all chunks for a specific document
   */
  async getDocumentChunks(documentId: string): Promise<VectorDocument[]> {
    const table = await this.ensureTable();
    if (!table) {
      return [];
    }

    try {
      const results = await table
        .query()
        .where(`metadata.documentId = "${documentId}"`)
        .limit(10000)
        .toArray();

      return results as unknown as VectorDocument[];
    } catch {
      return [];
    }
  }

  /**
   * Delete all chunks for a specific document
   */
  async deleteDocument(documentId: string): Promise<void> {
    if (!documentId) {
      throw new Error('Document ID is required');
    }

    const table = await this.ensureTable();
    if (!table) {
      return;
    }

    await table.delete(`metadata.documentId = "${documentId}"`);
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
    const table = await this.ensureTable();
    if (!table) {
      return 0;
    }

    try {
      const count = await table.countRows();
      return count;
    } catch {
      return 0;
    }
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
}

// Export a singleton instance
export const ragDatabase = new RAGDatabase();

// Export the class for custom instances
export { RAGDatabase };
