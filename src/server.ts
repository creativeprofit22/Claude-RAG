/**
 * Claude RAG - HTTP Server
 * Simple Bun HTTP server with CORS support for local development
 * Supports both Claude Code CLI and Gemini responders
 */

import { addDocument, listDocuments, deleteDocument, isReady, search } from './index.js';
import { generateResponse as generateClaudeResponse, streamResponse as streamClaudeResponse } from './responder.js';
import { generateResponse as generateGeminiResponse, streamResponse as streamGeminiResponse, checkGeminiReady } from './responder-gemini.js';
import { generateQueryEmbedding } from './embeddings.js';
import { ragDatabase } from './database.js';
import { filterAndRankChunks, type SubAgentResult } from './subagents/index.js';
import { getDefaultConfig } from './config.js';
import { logger } from './utils/logger.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const PORT = process.env.PORT || 3000;
const MAX_PAYLOAD_SIZE = 10 * 1024 * 1024; // 10MB limit

// CORS origin configuration - defaults to localhost for security
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

/**
 * Validate optional string field from request body
 */
function validateOptionalString(value: unknown, fieldName: string): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') {
    throw new Error(`Field '${fieldName}' must be a string`);
  }
  return value;
}

/**
 * Validate optional number field from request body
 */
function validateOptionalNumber(value: unknown, fieldName: string): number | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Field '${fieldName}' must be a number`);
  }
  return value;
}

/**
 * Validate optional boolean field from request body
 */
function validateOptionalBoolean(value: unknown, fieldName: string): boolean | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'boolean') {
    throw new Error(`Field '${fieldName}' must be a boolean`);
  }
  return value;
}

/**
 * Validate Content-Length header against max payload size
 */
function validateContentLength(req: Request): void {
  const contentLength = req.headers.get('Content-Length');
  if (contentLength) {
    const size = parseInt(contentLength, 10);
    if (!Number.isNaN(size) && size > MAX_PAYLOAD_SIZE) {
      throw new Error(`Payload too large. Maximum size is ${MAX_PAYLOAD_SIZE / 1024 / 1024}MB`);
    }
  }
}

// Responder types
type ResponderType = 'claude' | 'gemini' | 'auto';

// CORS headers - configurable origin for security
const corsHeaders = {
  'Access-Control-Allow-Origin': CORS_ORIGIN,
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Responder',
};

// Helper to create JSON response
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

// Helper to create error response
function errorResponse(message: string, status = 400): Response {
  return jsonResponse({ error: message }, status);
}

// Parse URL path and extract route params
function parseRoute(pathname: string): { route: string; params: Record<string, string> } {
  // Match /api/rag/documents/:id pattern
  const docIdMatch = pathname.match(/^\/api\/rag\/documents\/([^\/]+)$/);
  if (docIdMatch) {
    return { route: '/api/rag/documents/:id', params: { id: docIdMatch[1] } };
  }
  return { route: pathname, params: {} };
}

/**
 * Check if Claude Code CLI is available
 */
async function checkClaudeCodeAvailable(): Promise<boolean> {
  try {
    await execAsync('which claude');
    return true;
  } catch {
    return false;
  }
}

/**
 * Determine which responder to use based on request preferences and availability
 */
async function resolveResponder(
  requestedResponder: ResponderType
): Promise<{ responder: 'claude' | 'gemini'; fallback: boolean; message?: string }> {
  const claudeAvailable = await checkClaudeCodeAvailable();
  const geminiAvailable = !!process.env.GOOGLE_AI_API_KEY;

  // Explicit Claude request
  if (requestedResponder === 'claude') {
    if (claudeAvailable) {
      return { responder: 'claude', fallback: false };
    }
    // Claude requested but not available - check if we can fallback
    if (geminiAvailable) {
      return {
        responder: 'gemini',
        fallback: true,
        message: 'Claude Code CLI not available, falling back to Gemini'
      };
    }
    throw new Error(
      'Claude Code CLI is not installed or not in PATH. ' +
      'Install it with: npm install -g @anthropic-ai/claude-code'
    );
  }

  // Explicit Gemini request
  if (requestedResponder === 'gemini') {
    if (geminiAvailable) {
      return { responder: 'gemini', fallback: false };
    }
    throw new Error(
      'GOOGLE_AI_API_KEY environment variable is required for Gemini responder. ' +
      'Get one at https://aistudio.google.com/apikey'
    );
  }

  // Auto mode: prefer Claude if available, fallback to Gemini
  if (claudeAvailable) {
    return { responder: 'claude', fallback: false };
  }
  if (geminiAvailable) {
    return {
      responder: 'gemini',
      fallback: true,
      message: 'Claude Code CLI not available, using Gemini'
    };
  }

  throw new Error(
    'No responder available. Either install Claude Code CLI (npm install -g @anthropic-ai/claude-code) ' +
    'or set GOOGLE_AI_API_KEY for Gemini.'
  );
}

/**
 * Get responder preference from request (query param or header)
 */
function getResponderPreference(req: Request, url: URL): ResponderType {
  // Check query parameter first: ?responder=claude or ?responder=gemini
  const queryParam = url.searchParams.get('responder');
  if (queryParam === 'claude' || queryParam === 'gemini') {
    return queryParam;
  }

  // Check header: X-Responder: claude or X-Responder: gemini
  const headerValue = req.headers.get('X-Responder')?.toLowerCase();
  if (headerValue === 'claude' || headerValue === 'gemini') {
    return headerValue;
  }

  // Default to auto (prefer Claude, fallback to Gemini)
  return 'auto';
}

interface QueryOptions {
  topK?: number;
  documentId?: string;
  compress?: boolean;
  systemPrompt?: string;
  responder?: ResponderType;
}

interface QueryResult {
  answer: string;
  sources: Array<{ documentId: string; documentName: string; chunkIndex: number; snippet: string }>;
  tokensUsed: { input: number; output: number };
  subAgentResult?: SubAgentResult;
  responder: 'claude' | 'gemini';
  responderFallback?: boolean;
  responderMessage?: string;
  timing: {
    embedding: number;
    search: number;
    filtering?: number;
    response: number;
    total: number;
  };
}

/**
 * Main RAG query function with responder selection
 */
async function query(
  userQuery: string,
  options: QueryOptions = {}
): Promise<QueryResult> {
  const config = getDefaultConfig();
  const { topK = config.topK, compress = false, documentId, responder: requestedResponder = 'auto' } = options;
  const timing: QueryResult['timing'] = { embedding: 0, search: 0, response: 0, total: 0 };
  const startTotal = Date.now();

  logger.info(`Processing query: "${userQuery.slice(0, 50)}..."`);

  // Resolve which responder to use
  const { responder, fallback, message: responderMessage } = await resolveResponder(requestedResponder);
  if (responderMessage) {
    logger.info(responderMessage);
  }

  // Step 1: Generate query embedding
  const startEmbed = Date.now();
  const queryVector = await generateQueryEmbedding(userQuery);
  timing.embedding = Date.now() - startEmbed;
  logger.debug(`Embedding generated in ${timing.embedding}ms`);

  // Step 2: Search vector database
  const startSearch = Date.now();
  const searchResults = await ragDatabase.search(queryVector, {
    limit: compress ? topK * 3 : topK,
    filter: documentId ? `metadata.documentId = "${documentId}"` : undefined
  });
  timing.search = Date.now() - startSearch;
  logger.debug(`Found ${searchResults.length} chunks in ${timing.search}ms`);

  if (searchResults.length === 0) {
    return {
      answer: "I don't have any documents to search. Please upload some documents first.",
      sources: [],
      tokensUsed: { input: 0, output: 0 },
      responder,
      ...(fallback && { responderFallback: true, responderMessage }),
      timing: { ...timing, total: Date.now() - startTotal }
    };
  }

  // Build chunks array from search results
  const chunks = searchResults.map((r) => ({
    text: r.text,
    documentId: r.metadata.documentId,
    documentName: r.metadata.documentName,
    chunkIndex: r.metadata.chunkIndex,
    score: r._distance || 0
  }));

  let context: string;
  let sources: Array<{ documentId: string; documentName: string; chunkIndex: number; snippet: string }>;
  let subAgentResult: SubAgentResult | undefined;

  if (compress) {
    // Step 3a: Haiku sub-agent filters and compresses
    const startFilter = Date.now();
    subAgentResult = await filterAndRankChunks(userQuery, chunks, {
      compress: true,
      maxChunks: topK
    });
    timing.filtering = Date.now() - startFilter;
    logger.debug(`Haiku filtered to ${subAgentResult.selectedChunks.length} chunks in ${timing.filtering}ms`);

    context = subAgentResult.relevantContext;
    sources = subAgentResult.selectedChunks.map(i => ({
      documentId: chunks[i].documentId,
      documentName: chunks[i].documentName,
      chunkIndex: chunks[i].chunkIndex,
      snippet: chunks[i].text.slice(0, 150) + '...'
    }));
  } else {
    // Step 3b: Direct flow - format chunks without Haiku
    logger.debug(`Direct flow: passing ${chunks.length} chunks to ${responder}`);

    context = chunks.map((chunk) => {
      return `[Source: ${chunk.documentName}, Chunk ${chunk.chunkIndex}]\n${chunk.text}`;
    }).join('\n\n---\n\n');

    sources = chunks.map(chunk => ({
      documentId: chunk.documentId,
      documentName: chunk.documentName,
      chunkIndex: chunk.chunkIndex,
      snippet: chunk.text.slice(0, 150) + '...'
    }));
  }

  // Step 4: Generate response using selected responder
  const startResponse = Date.now();
  const generateResponse = responder === 'claude' ? generateClaudeResponse : generateGeminiResponse;

  let response;
  try {
    response = await generateResponse(
      userQuery,
      context,
      sources,
      { systemPrompt: options.systemPrompt }
    );
  } catch (error) {
    // If Claude fails and Gemini is available, try fallback
    if (responder === 'claude' && process.env.GOOGLE_AI_API_KEY) {
      logger.warn(`Claude responder failed, falling back to Gemini: ${error}`);
      response = await generateGeminiResponse(
        userQuery,
        context,
        sources,
        { systemPrompt: options.systemPrompt }
      );
      timing.response = Date.now() - startResponse;
      timing.total = Date.now() - startTotal;

      return {
        ...response,
        subAgentResult,
        responder: 'gemini',
        responderFallback: true,
        responderMessage: `Claude Code CLI failed, used Gemini fallback: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timing
      };
    }
    throw error;
  }

  timing.response = Date.now() - startResponse;
  timing.total = Date.now() - startTotal;

  logger.info(`Query completed in ${timing.total}ms using ${responder}`);

  return {
    ...response,
    ...(subAgentResult && { subAgentResult }),
    responder,
    ...(fallback && { responderFallback: true, responderMessage }),
    timing
  };
}

// Main request handler
async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const { route, params } = parseRoute(url.pathname);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // GET /api/health - Health check
    if (route === '/api/health' && req.method === 'GET') {
      const status = await isReady();
      const claudeAvailable = await checkClaudeCodeAvailable();
      const geminiAvailable = !!process.env.GOOGLE_AI_API_KEY;

      return jsonResponse({
        status: status.ready ? 'healthy' : 'unhealthy',
        ...status,
        responders: {
          claude: claudeAvailable,
          gemini: geminiAvailable,
          default: claudeAvailable ? 'claude' : (geminiAvailable ? 'gemini' : 'none')
        },
        timestamp: new Date().toISOString(),
      });
    }

    // GET /api/responders - Get available responders
    if (route === '/api/responders' && req.method === 'GET') {
      const claudeAvailable = await checkClaudeCodeAvailable();
      const geminiAvailable = !!process.env.GOOGLE_AI_API_KEY;

      // Optionally check if Gemini is actually responding
      let geminiReady = false;
      if (geminiAvailable) {
        try {
          geminiReady = await checkGeminiReady();
        } catch {
          geminiReady = false;
        }
      }

      return jsonResponse({
        available: {
          claude: {
            available: claudeAvailable,
            description: 'Claude Code CLI (requires installation and authentication)'
          },
          gemini: {
            available: geminiAvailable,
            ready: geminiReady,
            description: 'Google Gemini 2.0 Flash (requires GOOGLE_AI_API_KEY)'
          }
        },
        default: claudeAvailable ? 'claude' : (geminiAvailable ? 'gemini' : 'none'),
        usage: {
          queryParam: '?responder=claude or ?responder=gemini',
          header: 'X-Responder: claude or X-Responder: gemini'
        }
      });
    }

    // POST /api/rag/upload - Upload and process document
    if (route === '/api/rag/upload' && req.method === 'POST') {
      validateContentLength(req);

      let body: Record<string, unknown>;
      try {
        body = await req.json() as Record<string, unknown>;
      } catch {
        return errorResponse('Invalid JSON in request body', 400);
      }

      if (!body.text || typeof body.text !== 'string') {
        return errorResponse('Missing required field: text');
      }
      if (!body.name || typeof body.name !== 'string') {
        return errorResponse('Missing required field: name');
      }

      // Validate optional fields with proper type checking
      const source = validateOptionalString(body.source, 'source');
      const type = validateOptionalString(body.type, 'type');

      const result = await addDocument(body.text, {
        name: body.name,
        source,
        type,
      });

      return jsonResponse({
        success: true,
        documentId: result.documentId,
        chunks: result.chunks,
        message: `Document "${body.name}" uploaded and processed into ${result.chunks} chunks`,
      }, 201);
    }

    // POST /api/rag/query - Query with RAG
    if (route === '/api/rag/query' && req.method === 'POST') {
      validateContentLength(req);

      let body: Record<string, unknown>;
      try {
        body = await req.json() as Record<string, unknown>;
      } catch {
        return errorResponse('Invalid JSON in request body', 400);
      }

      if (!body.query || typeof body.query !== 'string' || (body.query as string).trim().length === 0) {
        return errorResponse('Missing required field: query (must be non-empty string)');
      }

      // Validate optional fields with proper type checking
      const topK = validateOptionalNumber(body.topK, 'topK');
      const documentId = validateOptionalString(body.documentId, 'documentId');
      const compress = validateOptionalBoolean(body.compress, 'compress');
      const systemPrompt = validateOptionalString(body.systemPrompt, 'systemPrompt');

      // Get responder preference from body, query param, or header
      const responderValue = validateOptionalString(body.responder, 'responder');
      const responderPreference: ResponderType =
        (responderValue === 'claude' || responderValue === 'gemini' || responderValue === 'auto')
          ? responderValue
          : getResponderPreference(req, url);

      const result = await query(body.query, {
        topK,
        documentId,
        compress,
        systemPrompt,
        responder: responderPreference,
      });

      return jsonResponse({
        answer: result.answer,
        sources: result.sources,
        tokensUsed: result.tokensUsed,
        timing: result.timing,
        responder: result.responder,
        ...(result.responderFallback && {
          responderFallback: result.responderFallback,
          responderMessage: result.responderMessage
        }),
        ...(result.subAgentResult && { subAgentResult: result.subAgentResult }),
      });
    }

    // POST /api/rag/search - Search only (no LLM call)
    if (route === '/api/rag/search' && req.method === 'POST') {
      validateContentLength(req);

      let body: Record<string, unknown>;
      try {
        body = await req.json() as Record<string, unknown>;
      } catch {
        return errorResponse('Invalid JSON in request body', 400);
      }

      if (!body.query || typeof body.query !== 'string' || (body.query as string).trim().length === 0) {
        return errorResponse('Missing required field: query (must be non-empty string)');
      }

      // Validate optional fields with proper type checking
      const topK = validateOptionalNumber(body.topK, 'topK');
      const documentId = validateOptionalString(body.documentId, 'documentId');

      const result = await search(body.query, {
        topK,
        documentId,
      });

      return jsonResponse({
        context: result.context,
        chunks: result.chunks,
        timing: result.timing,
      });
    }

    // GET /api/rag/documents - List documents
    if (route === '/api/rag/documents' && req.method === 'GET') {
      const documents = await listDocuments();
      return jsonResponse({
        documents,
        count: documents.length,
      });
    }

    // DELETE /api/rag/documents/:id - Delete document
    if (route === '/api/rag/documents/:id' && req.method === 'DELETE') {
      const documentId = params.id;

      if (!documentId) {
        return errorResponse('Document ID is required');
      }

      await deleteDocument(documentId);
      return jsonResponse({
        success: true,
        message: `Document ${documentId} deleted`,
      });
    }

    // 404 for unknown routes
    return errorResponse('Not found', 404);

  } catch (error) {
    console.error('Request error:', error);
    // Sanitize error messages to prevent leaking implementation details
    let message = 'Internal server error';
    if (error instanceof Error) {
      // Only expose safe, user-friendly error messages
      const safePatterns = [
        /^Query must be/,
        /^Missing required field/,
        /^Invalid/,
        /^Document .* not found/,
        /^Claude Code/,
        /^Gemini API/,
        /^Rate limit/,
        /^Payload too large/,
        /^GOOGLE_AI_API_KEY/,
        /^No responder available/
      ];
      const isSafeMessage = safePatterns.some(pattern => pattern.test(error.message));
      message = isSafeMessage ? error.message : 'Internal server error';
    }
    return errorResponse(message, 500);
  }
}

// Start server
console.log(`Claude RAG Server starting on port ${PORT}...`);

// Bun.serve - requires Bun runtime
declare const Bun: {
  serve: (options: { port: number; fetch: (req: Request) => Promise<Response> }) => void;
};

Bun.serve({
  port: Number(PORT),
  fetch: handleRequest,
});

console.log(`Server running at http://localhost:${PORT}`);
console.log('');
console.log('Available endpoints:');
console.log('  GET  /api/health              - Health check (includes responder status)');
console.log('  GET  /api/responders          - Get available responders');
console.log('  POST /api/rag/upload          - Upload document');
console.log('  POST /api/rag/query           - Query with RAG (supports ?responder=claude|gemini)');
console.log('  POST /api/rag/search          - Search only (no LLM call)');
console.log('  GET  /api/rag/documents       - List documents');
console.log('  DELETE /api/rag/documents/:id - Delete document');
console.log('');
console.log('Responder selection:');
console.log('  Query param: ?responder=claude or ?responder=gemini');
console.log('  Header: X-Responder: claude or X-Responder: gemini');
console.log('  Body: { "responder": "claude" } or { "responder": "gemini" }');
console.log('  Default: auto (prefers Claude, falls back to Gemini)');
