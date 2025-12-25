/**
 * Claude RAG - HTTP Server
 * Simple Bun HTTP server with CORS support for local development
 * Supports both Claude Code CLI and Gemini responders
 */

import { addDocument, addDocumentWithProgress, estimateChunks, listDocuments, deleteDocument, isReady, search, query, getDocumentSummaries, getDocumentDetails, type QueryResult, type UploadProgress } from './index.js';
import { extractText, isSupported, getMimeType } from './extractors/index.js';
import { checkGeminiReady } from './responder-gemini.js';
import { logger } from './utils/logger.js';
import { checkClaudeCodeAvailable } from './utils/cli.js';
import { readFileSync, existsSync, realpathSync } from 'fs';
import { join, extname, resolve, normalize } from 'path';
import {
  initializeCategoryStore,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getDocumentMetadata,
  setDocumentCategories,
  setDocumentTags,
  getTags,
  addTag,
  removeTag,
  type Category,
} from './categories.js';

const PORT = process.env.PORT || 3000;

// Static file MIME types
const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// Demo directory path - use process.cwd() for reliability
const DEMO_DIR = join(process.cwd(), 'demo');
const MAX_PAYLOAD_SIZE = 10 * 1024 * 1024; // 10MB limit

// CORS origin configuration - allow all localhost ports for development
// SECURITY: '*' is for development only. In production, set CORS_ORIGIN to specific allowed origins.
// TODO: For production deployments, restrict CORS_ORIGIN to your frontend domain(s)
//       e.g., CORS_ORIGIN=https://your-app.com or CORS_ORIGIN=https://app1.com,https://app2.com
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// Type guards for validation
const isString = (v: unknown): v is string => typeof v === 'string';
const isNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isBoolean = (v: unknown): v is boolean => typeof v === 'boolean';

/**
 * Generic validator for optional request body fields
 */
function validateOptional<T>(
  value: unknown,
  fieldName: string,
  typeGuard: (v: unknown) => v is T,
  typeName: string
): T | undefined {
  if (value === undefined || value === null) return undefined;
  if (!typeGuard(value)) {
    throw new Error(`Field '${fieldName}' must be a ${typeName}`);
  }
  return value;
}

// Convenience wrappers for common types
const validateOptionalString = (v: unknown, f: string) => validateOptional(v, f, isString, 'string');
const validateOptionalNumber = (v: unknown, f: string) => validateOptional(v, f, isNumber, 'number');
const validateOptionalBoolean = (v: unknown, f: string) => validateOptional(v, f, isBoolean, 'boolean');

/**
 * Parse JSON body from request with error handling
 * Returns Result-like object to avoid try-catch duplication
 */
async function parseJsonBody(req: Request): Promise<{ ok: true; data: Record<string, unknown> } | { ok: false; error: Response }> {
  try {
    const data = await req.json() as Record<string, unknown>;
    return { ok: true, data };
  } catch {
    return { ok: false, error: errorResponse('Invalid JSON in request body', 400) };
  }
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
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
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
  // Match /api/rag/documents/:id/metadata pattern (for category/tag updates)
  const docMetadataMatch = pathname.match(/^\/api\/rag\/documents\/([^\/]+)\/metadata$/);
  if (docMetadataMatch) {
    return { route: '/api/rag/documents/:id/metadata', params: { id: docMetadataMatch[1] } };
  }
  // Match /api/rag/documents/:id/details pattern (must come before :id pattern)
  const docDetailsMatch = pathname.match(/^\/api\/rag\/documents\/([^\/]+)\/details$/);
  if (docDetailsMatch) {
    return { route: '/api/rag/documents/:id/details', params: { id: docDetailsMatch[1] } };
  }
  // Match /api/rag/documents/:id pattern
  const docIdMatch = pathname.match(/^\/api\/rag\/documents\/([^\/]+)$/);
  if (docIdMatch) {
    return { route: '/api/rag/documents/:id', params: { id: docIdMatch[1] } };
  }
  // Match /api/rag/categories/:id pattern
  const catIdMatch = pathname.match(/^\/api\/rag\/categories\/([^\/]+)$/);
  if (catIdMatch) {
    return { route: '/api/rag/categories/:id', params: { id: catIdMatch[1] } };
  }
  return { route: pathname, params: {} };
}

/**
 * Route configuration with metadata
 */
interface RouteConfig {
  path: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
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
  uploadStream: {
    path: '/api/rag/upload/stream',
    method: 'POST',
    description: 'Upload document with SSE progress streaming'
  },
  uploadEstimate: {
    path: '/api/rag/upload/estimate',
    method: 'POST',
    description: 'Estimate chunk count for text'
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
  },
  documentsDetails: {
    path: '/api/rag/documents/details',
    method: 'GET',
    description: 'List all documents with full metadata'
  },
  documentDetails: {
    path: '/api/rag/documents/:id/details',
    method: 'GET',
    description: 'Get single document details with chunk previews'
  },
  documentMetadata: {
    path: '/api/rag/documents/:id/metadata',
    method: 'PATCH',
    description: 'Update document categories and tags'
  },
  // Category endpoints
  categories: {
    path: '/api/rag/categories',
    method: 'GET',
    description: 'List all categories'
  },
  createCategory: {
    path: '/api/rag/categories',
    method: 'POST',
    description: 'Create a new category'
  },
  updateCategory: {
    path: '/api/rag/categories/:id',
    method: 'PATCH',
    description: 'Update a category'
  },
  deleteCategory: {
    path: '/api/rag/categories/:id',
    method: 'DELETE',
    description: 'Delete a category'
  },
  // Tags endpoint
  tags: {
    path: '/api/rag/tags',
    method: 'GET',
    description: 'List all tags'
  }
};

// Valid routes for CORS preflight (derived from ROUTES)
const VALID_ROUTES = Object.values(ROUTES)
  .filter(r => !r.path.includes(':'))
  .map(r => r.path);

// Handler context passed to route handlers
interface HandlerContext {
  req: Request;
  url: URL;
  params: Record<string, string>;
}

// Route handler type
type RouteHandler = (ctx: HandlerContext) => Promise<Response>;

// Route-to-handler mapping
const ROUTE_HANDLERS: Record<string, RouteHandler> = {
  [`GET:${ROUTES.health.path}`]: () => handleHealthCheck(),
  [`GET:${ROUTES.responders.path}`]: () => handleRespondersCheck(),
  [`POST:${ROUTES.upload.path}`]: ({ req }) => handleUpload(req),
  [`POST:${ROUTES.uploadStream.path}`]: ({ req }) => handleUploadStream(req),
  [`POST:${ROUTES.uploadEstimate.path}`]: ({ req }) => handleUploadEstimate(req),
  [`POST:${ROUTES.query.path}`]: ({ req, url }) => handleQuery(req, url),
  [`POST:${ROUTES.search.path}`]: ({ req }) => handleSearch(req),
  [`GET:${ROUTES.documents.path}`]: () => handleListDocuments(),
  [`DELETE:${ROUTES.deleteDocument.path}`]: ({ params }) => handleDeleteDocument(params.id),
  [`GET:${ROUTES.documentsDetails.path}`]: () => handleListDocumentsDetails(),
  [`GET:${ROUTES.documentDetails.path}`]: ({ params }) => handleGetDocumentDetails(params.id),
  [`PATCH:${ROUTES.documentMetadata.path}`]: ({ req, params }) => handleUpdateDocumentMetadata(req, params.id),
  // Category handlers
  [`GET:${ROUTES.categories.path}`]: () => handleGetCategories(),
  [`POST:${ROUTES.createCategory.path}`]: ({ req }) => handleCreateCategory(req),
  [`PATCH:${ROUTES.updateCategory.path}`]: ({ req, params }) => handleUpdateCategory(req, params.id),
  [`DELETE:${ROUTES.deleteCategory.path}`]: ({ params }) => handleDeleteCategory(params.id),
  // Tags handler
  [`GET:${ROUTES.tags.path}`]: () => handleGetTags(),
};

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
      default: getDefaultResponder(claudeAvailable, geminiAvailable)
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

  const parsed = await parseJsonBody(req);
  if (!parsed.ok) return parsed.error;
  const body = parsed.data;

  if (!body.text || typeof body.text !== 'string') {
    return errorResponse('Missing required field: text');
  }
  if (!body.name || typeof body.name !== 'string') {
    return errorResponse('Missing required field: name');
  }

  const source = validateOptionalString(body.source, 'source');
  const type = validateOptionalString(body.type, 'type');

  try {
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Document upload failed:', { name: body.name, error: errorMessage });
    return errorResponse(`Failed to process document: ${errorMessage}`, 500);
  }
}

// SSE helper types and functions
const SSE_FLUSH_DELAY_MS = 10;

type SSEController = ReadableStreamDefaultController<Uint8Array>;
type SSESender = (event: string, data: unknown) => void;

/**
 * Create SSE message encoder
 */
function createSSEEncoder(): (event: string, data: unknown) => Uint8Array {
  const encoder = new TextEncoder();
  return (event: string, data: unknown) =>
    encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

/**
 * Close SSE stream with flush delay to ensure message delivery
 */
async function closeSSEWithFlush(controller: SSEController): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, SSE_FLUSH_DELAY_MS));
  controller.close();
}

/**
 * Send SSE error and close stream
 */
async function sendSSEError(
  controller: SSEController,
  send: SSESender,
  message: string
): Promise<void> {
  send('error', { message });
  await closeSSEWithFlush(controller);
}

// Upload form data parsing result
interface ParsedUploadForm {
  file: File;
  fileName: string;
  categoryIds?: string[];
  tags?: string[];
}

/**
 * Parse and validate multipart form data for upload
 */
async function parseUploadForm(
  req: Request,
  controller: SSEController,
  send: SSESender
): Promise<ParsedUploadForm | null> {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const customName = formData.get('name') as string | null;
  const categoryIdsRaw = formData.get('categoryIds') as string | null;
  const tagsRaw = formData.get('tags') as string | null;

  if (!file) {
    await sendSSEError(controller, send, 'No file provided');
    return null;
  }

  let categoryIds: string[] | undefined;
  let tags: string[] | undefined;
  try {
    categoryIds = categoryIdsRaw ? JSON.parse(categoryIdsRaw) : undefined;
    tags = tagsRaw ? JSON.parse(tagsRaw) : undefined;
  } catch {
    await sendSSEError(controller, send, 'Invalid JSON in categoryIds or tags');
    return null;
  }

  return {
    file,
    fileName: customName || file.name,
    categoryIds,
    tags,
  };
}

// Text extraction result
interface ExtractedContent {
  text: string;
  isScanned: boolean;
}

/**
 * Extract text from uploaded file with validation
 */
async function validateAndExtract(
  file: File,
  buffer: ArrayBuffer,
  controller: SSEController,
  send: SSESender
): Promise<ExtractedContent | null> {
  const mimeType = file.type || getMimeType(file.name) || 'application/octet-stream';

  if (!isSupported(mimeType) && !getMimeType(file.name)) {
    await sendSSEError(
      controller,
      send,
      `Unsupported file type: ${file.type || 'unknown'}. Supported: PDF, DOCX, TXT, MD, HTML`
    );
    return null;
  }

  try {
    const result = await extractText(buffer, mimeType, file.name);
    const text = result.text;
    const isScanned = result.isScanned ?? false;

    // Reject completely empty text extraction
    if (text.trim().length === 0) {
      await sendSSEError(
        controller,
        send,
        'No text could be extracted from this file. The document may be empty, scanned, or image-based.'
      );
      return null;
    }

    return { text, isScanned };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to extract text';
    await sendSSEError(controller, send, errorMsg);
    return null;
  }
}

// Minimum content length for warning
const MIN_CONTENT_LENGTH = 50;

/**
 * Process upload: chunk, embed, and store document
 */
async function processUpload(
  extracted: ExtractedContent,
  form: ParsedUploadForm,
  controller: SSEController,
  send: SSESender
): Promise<void> {
  // Warn if scanned or minimal text
  if (extracted.isScanned || extracted.text.trim().length < MIN_CONTENT_LENGTH) {
    send('warning', {
      message: 'This file appears to be scanned or has minimal text content. Text extraction may be incomplete.',
      isScanned: true,
    });
  }

  send('progress', { stage: 'extracting', percent: 30 });

  // Stage 3-5: Chunking, Embedding, Storing
  const result = await addDocumentWithProgress(
    extracted.text,
    {
      name: form.fileName,
      source: form.file.name,
      type: form.file.type,
      categoryIds: form.categoryIds,
      tags: form.tags,
    },
    (progress: UploadProgress) => {
      send('progress', progress);
    }
  );

  // Complete
  send('complete', {
    documentId: result.documentId,
    chunks: result.chunks,
    name: form.fileName,
  });
}

/**
 * POST /api/rag/upload/stream - Upload with SSE progress streaming
 */
async function handleUploadStream(req: Request): Promise<Response> {
  const stream = new ReadableStream({
    async start(controller) {
      const encode = createSSEEncoder();
      const send: SSESender = (event, data) => controller.enqueue(encode(event, data));

      try {
        // Parse form data
        const form = await parseUploadForm(req, controller, send);
        if (!form) return;

        // Stage 1: Reading file
        send('progress', { stage: 'reading', percent: 0 });
        const buffer = await form.file.arrayBuffer();
        send('progress', { stage: 'reading', percent: 10 });

        // Stage 2: Extract and validate
        send('progress', { stage: 'extracting', percent: 10 });
        const extracted = await validateAndExtract(form.file, buffer, controller, send);
        if (!extracted) return;

        // Stage 3-5: Process and store
        await processUpload(extracted, form, controller, send);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Upload failed';
        logger.error('Stream upload failed:', { error: errorMsg });
        send('error', { message: errorMsg });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': CORS_ORIGIN,
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

/**
 * POST /api/rag/upload/estimate - Estimate chunk count
 */
async function handleUploadEstimate(req: Request): Promise<Response> {
  validateContentLength(req);

  const parsed = await parseJsonBody(req);
  if (!parsed.ok) return parsed.error;
  const body = parsed.data;

  if (!body.text || typeof body.text !== 'string') {
    return errorResponse('Missing required field: text');
  }

  const result = estimateChunks(body.text);
  return jsonResponse(result);
}

/**
 * POST /api/rag/query - Query with RAG
 */
async function handleQuery(req: Request, url: URL): Promise<Response> {
  validateContentLength(req);

  const parsed = await parseJsonBody(req);
  if (!parsed.ok) return parsed.error;
  const body = parsed.data;

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

  const parsed = await parseJsonBody(req);
  if (!parsed.ok) return parsed.error;
  const body = parsed.data;

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
 * GET /api/rag/documents/details - List all documents with full metadata
 */
async function handleListDocumentsDetails(): Promise<Response> {
  const documents = await getDocumentSummaries();
  return jsonResponse({
    documents,
  });
}

/**
 * GET /api/rag/documents/:id/details - Get single document details
 */
async function handleGetDocumentDetails(documentId: string): Promise<Response> {
  if (!documentId) {
    return errorResponse('Document ID is required');
  }

  const details = await getDocumentDetails(documentId);
  if (!details) {
    return errorResponse('Document not found', 404);
  }

  return jsonResponse(details);
}

/**
 * PATCH /api/rag/documents/:id/metadata - Update document categories and tags
 */
async function handleUpdateDocumentMetadata(req: Request, documentId: string): Promise<Response> {
  if (!documentId) {
    return errorResponse('Document ID is required');
  }

  const parsed = await parseJsonBody(req);
  if (!parsed.ok) return parsed.error;
  const body = parsed.data;

  // Validate categories array if provided
  if (body.categories !== undefined) {
    if (!Array.isArray(body.categories)) {
      return errorResponse('categories must be an array of strings');
    }
    for (const cat of body.categories) {
      if (typeof cat !== 'string') {
        return errorResponse('categories must be an array of strings');
      }
    }
    setDocumentCategories(documentId, body.categories as string[]);
  }

  // Validate tags array if provided
  if (body.tags !== undefined) {
    if (!Array.isArray(body.tags)) {
      return errorResponse('tags must be an array of strings');
    }
    for (const tag of body.tags) {
      if (typeof tag !== 'string') {
        return errorResponse('tags must be an array of strings');
      }
    }
    setDocumentTags(documentId, body.tags as string[]);
  }

  // Return updated metadata
  const metadata = getDocumentMetadata(documentId);
  return jsonResponse({
    success: true,
    documentId,
    ...metadata,
  });
}

// ============================================
// Category Handlers
// ============================================

/**
 * GET /api/rag/categories - List all categories
 */
async function handleGetCategories(): Promise<Response> {
  const categories = getCategories();
  return jsonResponse({
    categories,
    count: categories.length,
  });
}

/**
 * POST /api/rag/categories - Create a new category
 */
async function handleCreateCategory(req: Request): Promise<Response> {
  const parsed = await parseJsonBody(req);
  if (!parsed.ok) return parsed.error;
  const body = parsed.data;

  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    return errorResponse('Missing required field: name (non-empty string)');
  }

  if (!body.color || typeof body.color !== 'string') {
    return errorResponse('Missing required field: color (hex color string)');
  }

  // Validate hex color format
  if (!/^#[0-9A-Fa-f]{6}$/.test(body.color)) {
    return errorResponse('Invalid color format. Use hex format: #RRGGBB');
  }

  const icon = validateOptionalString(body.icon, 'icon');

  try {
    const category = createCategory(body.name, body.color, icon);
    return jsonResponse({
      success: true,
      category,
    }, 201);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return errorResponse(`Failed to create category: ${errorMessage}`, 500);
  }
}

/**
 * PATCH /api/rag/categories/:id - Update a category
 */
async function handleUpdateCategory(req: Request, categoryId: string): Promise<Response> {
  if (!categoryId) {
    return errorResponse('Category ID is required');
  }

  const parsed = await parseJsonBody(req);
  if (!parsed.ok) return parsed.error;
  const body = parsed.data;

  const updates: Partial<Category> = {};

  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || body.name.trim().length === 0) {
      return errorResponse('name must be a non-empty string');
    }
    updates.name = body.name;
  }

  if (body.color !== undefined) {
    if (typeof body.color !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(body.color)) {
      return errorResponse('Invalid color format. Use hex format: #RRGGBB');
    }
    updates.color = body.color;
  }

  if (body.icon !== undefined) {
    if (typeof body.icon !== 'string') {
      return errorResponse('icon must be a string');
    }
    updates.icon = body.icon;
  }

  if (Object.keys(updates).length === 0) {
    return errorResponse('No valid fields to update. Provide name, color, or icon.');
  }

  const category = updateCategory(categoryId, updates);
  if (!category) {
    return errorResponse('Category not found', 404);
  }

  return jsonResponse({
    success: true,
    category,
  });
}

/**
 * DELETE /api/rag/categories/:id - Delete a category
 */
async function handleDeleteCategory(categoryId: string): Promise<Response> {
  if (!categoryId) {
    return errorResponse('Category ID is required');
  }

  const deleted = deleteCategory(categoryId);
  if (!deleted) {
    return errorResponse('Category not found', 404);
  }

  return jsonResponse({
    success: true,
    message: `Category ${categoryId} deleted`,
  });
}

/**
 * GET /api/rag/tags - List all tags
 */
async function handleGetTags(): Promise<Response> {
  const tags = getTags();
  return jsonResponse({
    tags,
    count: tags.length,
  });
}

/**
 * Get the default responder based on availability (prefers Claude)
 */
function getDefaultResponder(claudeAvailable: boolean, geminiAvailable: boolean): 'claude' | 'gemini' | 'none' {
  return claudeAvailable ? 'claude' : (geminiAvailable ? 'gemini' : 'none');
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
    // Route dispatch using handler map
    const routeKey = `${req.method}:${route}`;
    const handler = ROUTE_HANDLERS[routeKey];
    if (handler) {
      return handler({ req, url, params });
    }

    // Serve static files from /demo
    if (req.method === 'GET' && (url.pathname === '/demo' || url.pathname.startsWith('/demo/'))) {
      let filePath = url.pathname === '/demo' || url.pathname === '/demo/'
        ? join(DEMO_DIR, 'index.html')
        : join(DEMO_DIR, url.pathname.replace('/demo/', ''));

      // Sanitize path to prevent directory traversal attacks
      const normalizedPath = normalize(resolve(filePath));
      const normalizedDemoDir = normalize(resolve(DEMO_DIR));
      if (!normalizedPath.startsWith(normalizedDemoDir + '/') && normalizedPath !== normalizedDemoDir) {
        return errorResponse('Access denied', 403);
      }
      filePath = normalizedPath;

      if (existsSync(filePath)) {
        const ext = extname(filePath);
        const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
        const content = readFileSync(filePath);
        return new Response(content, {
          status: 200,
          headers: {
            'Content-Type': mimeType,
            'Cache-Control': 'no-cache',
            ...corsHeaders,
          },
        });
      }
    }

    return errorResponse('Not found', 404);

  } catch (error) {
    console.error('Request error:', error);
    return errorResponse(sanitizeErrorMessage(error), 500);
  }
}

// Bun.serve - requires Bun runtime
declare const Bun: {
  serve: (options: { port: number; fetch: (req: Request) => Promise<Response> }) => void;
};

/**
 * Generate startup banner as a single structured log
 */
function printStartupBanner(): void {
  const endpoints = Object.values(ROUTES)
    .map(r => `  ${r.method.padEnd(6)} ${r.path.padEnd(25)} - ${r.description}`)
    .join('\n');

  const corsWarning = process.env.NODE_ENV === 'production' && CORS_ORIGIN === '*'
    ? `\n⚠️  WARNING: CORS allows all origins (*) in production. Set CORS_ORIGIN to your domain.\n`
    : '';

  console.log(`Claude RAG Server running at http://localhost:${PORT}
${corsWarning}
Demo UI: http://localhost:${PORT}/demo

Available endpoints:
${endpoints}

Responder selection:
  Query param: ?responder=claude or ?responder=gemini
  Header: X-Responder: claude or X-Responder: gemini
  Body: { "responder": "claude" } or { "responder": "gemini" }
  Default: auto (prefers Claude, falls back to Gemini)
`);
}

// Initialize category store
initializeCategoryStore();

// Start server
Bun.serve({
  port: Number(PORT),
  fetch: handleRequest,
});

printStartupBanner();
