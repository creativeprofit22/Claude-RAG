/**
 * Claude RAG - HTTP Server
 * Simple Bun HTTP server with CORS support for local development
 * Supports both Claude Code CLI and Gemini responders
 */

import { addDocument, listDocuments, deleteDocument, isReady, search, query, type QueryResult } from './index.js';
import { checkGeminiReady } from './responder-gemini.js';
import { logger } from './utils/logger.js';
import { checkClaudeCodeAvailable } from './utils/cli.js';

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
 * Route configuration with metadata
 */
interface RouteConfig {
  path: string;
  method: 'GET' | 'POST' | 'DELETE';
  description: string;
}

/**
 * API route definitions with metadata
 */
const ROUTES: Record<string, RouteConfig> = {
  health: {
    path: '/api/health',
    method: 'GET',
    description: 'Health check (includes responder status)'
  },
  responders: {
    path: '/api/responders',
    method: 'GET',
    description: 'Get available responders'
  },
  upload: {
    path: '/api/rag/upload',
    method: 'POST',
    description: 'Upload document'
  },
  query: {
    path: '/api/rag/query',
    method: 'POST',
    description: 'Query with RAG (supports ?responder=claude|gemini)'
  },
  search: {
    path: '/api/rag/search',
    method: 'POST',
    description: 'Search only (no LLM call)'
  },
  documents: {
    path: '/api/rag/documents',
    method: 'GET',
    description: 'List documents'
  },
  deleteDocument: {
    path: '/api/rag/documents/:id',
    method: 'DELETE',
    description: 'Delete document'
  }
};

// Valid routes for CORS preflight (derived from ROUTES)
const VALID_ROUTES = Object.values(ROUTES)
  .filter(r => !r.path.includes(':'))
  .map(r => r.path);

/**
 * GET /api/health - Health check
 */
async function handleHealthCheck(): Promise<Response> {
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

/**
 * GET /api/responders - Get available responders
 */
async function handleRespondersCheck(): Promise<Response> {
  const claudeAvailable = await checkClaudeCodeAvailable();
  const geminiAvailable = !!process.env.GOOGLE_AI_API_KEY;

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

/**
 * POST /api/rag/upload - Upload and process document
 */
async function handleUpload(req: Request): Promise<Response> {
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

/**
 * POST /api/rag/query - Query with RAG
 */
async function handleQuery(req: Request, url: URL): Promise<Response> {
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

  const topK = validateOptionalNumber(body.topK, 'topK');
  const documentId = validateOptionalString(body.documentId, 'documentId');
  const compress = validateOptionalBoolean(body.compress, 'compress');
  const systemPrompt = validateOptionalString(body.systemPrompt, 'systemPrompt');

  const responderValue = validateOptionalString(body.responder, 'responder');
  const responderPreference: 'claude' | 'gemini' | undefined =
    (responderValue === 'claude' || responderValue === 'gemini')
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
    responder: result.responderUsed,
    ...(result.responderFallback && {
      responderFallback: result.responderFallback,
      responderMessage: result.responderFallbackMessage
    }),
    ...(result.subAgentResult && { subAgentResult: result.subAgentResult }),
  });
}

/**
 * POST /api/rag/search - Search only (no LLM call)
 */
async function handleSearch(req: Request): Promise<Response> {
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

/**
 * GET /api/rag/documents - List documents
 */
async function handleListDocuments(): Promise<Response> {
  const documents = await listDocuments();
  return jsonResponse({
    documents,
    count: documents.length,
  });
}

/**
 * DELETE /api/rag/documents/:id - Delete document
 */
async function handleDeleteDocument(documentId: string): Promise<Response> {
  if (!documentId) {
    return errorResponse('Document ID is required');
  }

  await deleteDocument(documentId);
  return jsonResponse({
    success: true,
    message: `Document ${documentId} deleted`,
  });
}



/**
 * Get responder preference from request (query param or header)
 */
function getResponderPreference(req: Request, url: URL): 'claude' | 'gemini' | undefined {
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

  // Default to undefined (let query() decide)
  return undefined;
}

// Safe error patterns for client-facing messages
const SAFE_ERROR_PATTERNS = [
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

/**
 * Sanitize error message for client response
 */
function sanitizeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const isSafeMessage = SAFE_ERROR_PATTERNS.some(pattern => pattern.test(error.message));
    return isSafeMessage ? error.message : 'Internal server error';
  }
  return 'Internal server error';
}

// Main request handler
async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const { route, params } = parseRoute(url.pathname);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    const isValidRoute = VALID_ROUTES.includes(route) || route === '/api/rag/documents/:id';
    if (!isValidRoute) {
      return errorResponse('Not found', 404);
    }
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // Route dispatch using ROUTES metadata
    if (route === ROUTES.health.path && req.method === ROUTES.health.method) {
      return handleHealthCheck();
    }
    if (route === ROUTES.responders.path && req.method === ROUTES.responders.method) {
      return handleRespondersCheck();
    }
    if (route === ROUTES.upload.path && req.method === ROUTES.upload.method) {
      return handleUpload(req);
    }
    if (route === ROUTES.query.path && req.method === ROUTES.query.method) {
      return handleQuery(req, url);
    }
    if (route === ROUTES.search.path && req.method === ROUTES.search.method) {
      return handleSearch(req);
    }
    if (route === ROUTES.documents.path && req.method === ROUTES.documents.method) {
      return handleListDocuments();
    }
    if (route === ROUTES.deleteDocument.path && req.method === ROUTES.deleteDocument.method) {
      return handleDeleteDocument(params.id);
    }

    return errorResponse('Not found', 404);

  } catch (error) {
    console.error('Request error:', error);
    return errorResponse(sanitizeErrorMessage(error), 500);
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
// Generate endpoint list from ROUTES metadata
for (const route of Object.values(ROUTES)) {
  const method = route.method.padEnd(6);
  const path = route.path.padEnd(25);
  console.log(`  ${method} ${path} - ${route.description}`);
}
console.log('');
console.log('Responder selection:');
console.log('  Query param: ?responder=claude or ?responder=gemini');
console.log('  Header: X-Responder: claude or X-Responder: gemini');
console.log('  Body: { "responder": "claude" } or { "responder": "gemini" }');
console.log('  Default: auto (prefers Claude, falls back to Gemini)');
