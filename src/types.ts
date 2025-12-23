/**
 * RAG System Type Definitions
 */

/**
 * Configuration for the RAG system
 */
export interface RAGConfig {
  /** Model to use for sub-agent retrieval processing */
  haikuModel: string;
  /** Model to use for final synthesis */
  opusModel: string;
  /** Number of top results to retrieve */
  topK: number;
  /** Chunk size in words */
  chunkSize: number;
  /** Overlap between chunks in words */
  chunkOverlap: number;
  /** Path to the LanceDB database */
  dbPath: string;
  /** Anthropic API key */
  apiKey?: string;
}

/**
 * A document in the RAG system
 */
export interface Document {
  /** Unique identifier for the document */
  id: string;
  /** Original content of the document */
  content: string;
  /** Document metadata */
  metadata: DocumentMetadata;
  /** When the document was added */
  createdAt: Date;
}

/**
 * Metadata associated with a document
 */
export interface DocumentMetadata {
  /** Source file path or URL */
  source: string;
  /** Document title */
  title?: string;
  /** Document type (e.g., 'markdown', 'text', 'code') */
  type?: string;
  /** Additional custom metadata */
  [key: string]: unknown;
}

/**
 * A chunk of a document after splitting
 */
export interface Chunk {
  /** Unique identifier for the chunk */
  id: string;
  /** ID of the parent document */
  documentId: string;
  /** Chunk content */
  content: string;
  /** Position of this chunk in the document (0-indexed) */
  index: number;
  /** Start character position in original document */
  startOffset: number;
  /** End character position in original document */
  endOffset: number;
  /** Embedding vector */
  embedding?: number[];
}

/**
 * A chunk with its distance/similarity score from a query
 */
export interface ChunkWithDistance extends Chunk {
  /** Distance from query (lower is more similar) */
  distance: number;
  /** Similarity score (0-1, higher is more similar) */
  similarity: number;
}

/**
 * Result from the retrieval phase
 */
export interface RetrievalResult {
  /** Query that was used for retrieval */
  query: string;
  /** Retrieved chunks with scores */
  chunks: ChunkWithDistance[];
  /** Total number of chunks searched */
  totalSearched: number;
  /** Time taken for retrieval in milliseconds */
  retrievalTimeMs: number;
}

/**
 * Result from a Haiku sub-agent processing a chunk
 */
export interface SubAgentResult {
  /** The chunk that was processed */
  chunk: ChunkWithDistance;
  /** Summary or key points extracted by Haiku */
  summary: string;
  /** Relevance score assigned by Haiku (0-1) */
  relevanceScore: number;
  /** Key facts or entities extracted */
  extractedFacts: string[];
  /** Whether this chunk should be included in final synthesis */
  isRelevant: boolean;
  /** Processing time in milliseconds */
  processingTimeMs: number;
}

/**
 * Final response from the RAG system
 */
export interface RAGResponse {
  /** The original query */
  query: string;
  /** Final synthesized answer from Opus */
  answer: string;
  /** Sub-agent results from Haiku processing */
  subAgentResults: SubAgentResult[];
  /** Source documents/chunks used */
  sources: SourceReference[];
  /** Total processing time in milliseconds */
  totalTimeMs: number;
  /** Token usage statistics */
  tokenUsage: TokenUsage;
}

/**
 * Reference to a source used in the response
 */
export interface SourceReference {
  /** Document ID */
  documentId: string;
  /** Chunk ID */
  chunkId: string;
  /** Source path/URL */
  source: string;
  /** Relevance score */
  relevance: number;
  /** Snippet of the relevant content */
  snippet: string;
}

/**
 * Token usage statistics
 */
export interface TokenUsage {
  /** Tokens used by Haiku sub-agents */
  haikuInputTokens: number;
  haikuOutputTokens: number;
  /** Tokens used by Opus synthesis */
  opusInputTokens: number;
  opusOutputTokens: number;
  /** Total tokens */
  totalTokens: number;
}
