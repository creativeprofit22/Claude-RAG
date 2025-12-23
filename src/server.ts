/**
 * Claude RAG - HTTP Server
 * Simple Bun HTTP server with CORS support for local development
 */

import { query, addDocument, listDocuments, deleteDocument, isReady } from './index.js';

const PORT = process.env.PORT || 3000;

// CORS headers for local development
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
      return jsonResponse({
        status: status.ready ? 'healthy' : 'unhealthy',
        ...status,
        timestamp: new Date().toISOString(),
      });
    }

    // POST /api/rag/upload - Upload and process document
    if (route === '/api/rag/upload' && req.method === 'POST') {
      const body = await req.json();

      if (!body.text || typeof body.text !== 'string') {
        return errorResponse('Missing required field: text');
      }
      if (!body.name || typeof body.name !== 'string') {
        return errorResponse('Missing required field: name');
      }

      const result = await addDocument(body.text, {
        name: body.name,
        source: body.source,
        type: body.type,
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
      const body = await req.json();

      if (!body.query || typeof body.query !== 'string') {
        return errorResponse('Missing required field: query');
      }

      const result = await query(body.query, {
        topK: body.topK,
        documentId: body.documentId,
        compress: body.compress,
        systemPrompt: body.systemPrompt,
      });

      return jsonResponse({
        answer: result.answer,
        sources: result.sources,
        tokensUsed: result.tokensUsed,
        timing: result.timing,
        ...(result.subAgentResult && { subAgentResult: result.subAgentResult }),
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
    const message = error instanceof Error ? error.message : 'Internal server error';
    return errorResponse(message, 500);
  }
}

// Start server
console.log(`Claude RAG Server starting on port ${PORT}...`);

Bun.serve({
  port: Number(PORT),
  fetch: handleRequest,
});

console.log(`Server running at http://localhost:${PORT}`);
console.log('');
console.log('Available endpoints:');
console.log('  GET  /api/health              - Health check');
console.log('  POST /api/rag/upload          - Upload document');
console.log('  POST /api/rag/query           - Query with RAG');
console.log('  GET  /api/rag/documents       - List documents');
console.log('  DELETE /api/rag/documents/:id - Delete document');
