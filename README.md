# Claude RAG

A context retrieval library for Claude Code CLI that leverages your existing Claude subscription - no Anthropic API key required.

## Overview

This system provides semantic search over your documents using Google Gemini embeddings, then uses **Claude Code CLI** (your existing subscription) to generate responses. This means you get Claude Opus 4.5 quality responses without paying per-token API costs.

**Key Benefits:**
- **Zero Claude API costs** - Uses your Claude Pro/Team subscription via Claude Code CLI
- **High-quality embeddings** - Google Gemini embeddings for accurate retrieval
- **Local vector storage** - LanceDB for fast, efficient similarity search
- **Gemini fallback** - Can use Gemini for responses if Claude Code CLI unavailable

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Query     │────▶│   Gemini     │────▶│  LanceDB    │
│             │     │  Embeddings  │     │  Vector DB  │
└─────────────┘     └──────────────┘     └─────────────┘
                                               │
                   ┌───────────────────────────┘
                   │
                   ▼
       ┌───────────────────────┐
       │  Retrieved Chunks     │
       │  (Relevant Context)   │
       └───────────────────────┘
                   │
      ┌────────────┴────────────┐
      │                         │
      ▼                         ▼
┌─────────────────┐     ┌─────────────────┐
│  Claude Code    │     │    Gemini       │
│  CLI (Default)  │     │   (Fallback)    │
│                 │     │                 │
│  Your existing  │     │  RAG_RESPONDER  │
│  subscription   │     │  =gemini        │
└─────────────────┘     └─────────────────┘
          │                     │
          └──────────┬──────────┘
                     │
                     ▼
           ┌─────────────────┐
           │  Final Answer   │
           └─────────────────┘
```

### How It Works

1. **Embedding**: Your query is embedded using Google Gemini's embedding model
2. **Retrieval**: LanceDB finds the most similar document chunks
3. **Response Generation**:
   - **Claude Mode (default)**: Spawns Claude Code CLI with the query + retrieved context
   - **Gemini Mode (fallback)**: Uses Gemini API for response generation

## Prerequisites

### Required
- **Node.js** 18+
- **Google AI API key** - For embeddings (free tier available)
  - Get one at https://aistudio.google.com/apikey

### Recommended (for Claude responses)
- **Claude Code CLI** installed and authenticated
  - Install: `npm install -g @anthropic-ai/claude-code`
  - Authenticate: `claude login`
  - Requires Claude Pro, Team, or Enterprise subscription

### Alternative (Gemini fallback)
- Same Google AI API key works for both embeddings and responses

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd claude-rag

# Install dependencies
npm install

# Build TypeScript
npm run build
```

## Environment Variables

Create a `.env` file or export these environment variables:

```bash
# Required: Google AI API key for embeddings (and optionally responses)
# Get one at https://aistudio.google.com/apikey
export GOOGLE_AI_API_KEY="your-google-ai-api-key"

# Optional: Response provider (default: claude)
# - "claude": Use Claude Code CLI (requires subscription + CLI installed)
# - "gemini": Use Gemini API (uses same GOOGLE_AI_API_KEY)
export RAG_RESPONDER="claude"

# Optional: Custom Gemini embedding model (default: gemini-embedding-001)
export GEMINI_EMBEDDING_MODEL="gemini-embedding-001"

# Optional: Embedding output dimensionality (default: 1024)
# Supported: 256, 512, 768, 1024, 1536, 3072
export GEMINI_EMBEDDING_DIM="1024"

# Optional: Custom database path (default: ./data/vectors)
export RAG_DB_PATH="./data/vectors"
```

## Usage

### CLI

The CLI provides a simple interface for the RAG system:

```bash
# Add a document to the system
npx tsx src/cli.ts add ./docs/readme.md

# Query using Claude Code CLI (default)
npx tsx src/cli.ts query "How do I configure authentication?"

# Query using Gemini instead
RAG_RESPONDER=gemini npx tsx src/cli.ts query "How do I configure authentication?"

# Query with custom chunk count
npx tsx src/cli.ts query "What are the main features?" --topK 10

# List all documents
npx tsx src/cli.ts list

# Delete a document
npx tsx src/cli.ts delete doc_1234567890

# Check system status
npx tsx src/cli.ts status

# Enable verbose logging
npx tsx src/cli.ts query "How does X work?" --verbose
```

### Programmatic API

```typescript
import { query, addDocument, listDocuments, deleteDocument } from 'claude-rag';

// Add a document
const result = await addDocument(
  "Your document text here...",
  { name: "document.txt", source: "/path/to/document.txt" }
);
console.log(`Added ${result.chunks} chunks with ID: ${result.documentId}`);

// Query with Claude Code CLI (default)
const response = await query("What is this about?");
console.log(response.answer);

// Query with Gemini fallback
const geminiResponse = await query("Explain the architecture", {
  responder: 'gemini'
});
console.log(geminiResponse.answer);

// Query with custom settings
const customResponse = await query("What are the key features?", {
  topK: 10,
  documentId: "specific-doc-id"
});

// List documents
const docs = await listDocuments();

// Delete a document
await deleteDocument("doc_1234567890");
```

### Query Options

```typescript
interface QueryOptions {
  topK?: number;          // Number of chunks to retrieve (default: 5)
  documentId?: string;    // Filter to specific document
  responder?: 'claude' | 'gemini';  // Response provider (default: claude)
  stream?: boolean;       // Enable streaming response
  systemPrompt?: string;  // Custom system prompt
}
```

## React Components

Drop-in chat UI for any React project:

```bash
npm install claude-rag
```

### Quick Start

```tsx
import { RAGChat } from 'claude-rag/react';
import 'claude-rag/react/styles.css';

function App() {
  return (
    <div style={{ height: '600px' }}>
      <RAGChat
        endpoint="http://localhost:3000/api/rag/query"
        title="Document Assistant"
        accentColor="#6366f1"
      />
    </div>
  );
}
```

### RAGChat Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `endpoint` | `string` | `/api/rag/query` | API endpoint URL |
| `title` | `string` | `RAG Assistant` | Header title |
| `placeholder` | `string` | `Ask a question...` | Input placeholder |
| `accentColor` | `string` | `#6366f1` | Theme color (hex) |
| `showSources` | `boolean` | `true` | Show source citations |
| `systemPrompt` | `string` | - | Custom system prompt |
| `topK` | `number` | - | Number of chunks to retrieve |
| `documentId` | `string` | - | Filter to specific document |
| `headers` | `Record<string, string>` | - | Custom API headers |

### Custom Implementation

Use the hook for full control:

```tsx
import { useRAGChat, MessageBubble, ChatInput } from 'claude-rag/react';

function CustomChat() {
  const { messages, isTyping, sendMessage, clearChat } = useRAGChat({
    endpoint: '/api/rag/query',
  });

  return (
    <div>
      {messages.map(msg => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <ChatInput onSendMessage={sendMessage} disabled={isTyping} />
    </div>
  );
}
```

### Exported Components

| Component | Description |
|-----------|-------------|
| `RAGChat` | Complete drop-in chat interface |
| `ChatHeader` | Header with title and clear button |
| `ChatInput` | Input field with send button |
| `MessageBubble` | Message display with sources |
| `TypingIndicator` | Animated typing dots |
| `useRAGChat` | Hook for custom implementations |

## Project Structure

```
claude-rag/
├── src/
│   ├── index.ts           # Main entry point and query function
│   ├── embeddings.ts      # Google Gemini embedding generation
│   ├── database.ts        # LanceDB vector storage
│   ├── responder.ts       # Claude CLI response generation
│   ├── responder-gemini.ts # Gemini fallback response generation
│   ├── server.ts          # Bun HTTP server
│   ├── cli.ts             # Command-line interface
│   ├── config.ts          # Configuration and defaults
│   ├── types.ts           # TypeScript type definitions
│   ├── react/             # React UI components
│   │   ├── index.ts       # React exports
│   │   ├── RAGChat.tsx    # Drop-in chat component
│   │   ├── styles.css     # Standalone styles
│   │   ├── types.ts       # React-specific types
│   │   ├── components/    # Individual UI components
│   │   └── hooks/         # React hooks
│   └── utils/
│       └── logger.ts      # Logging utility
├── data/
│   └── vectors/           # LanceDB storage (gitignored)
├── package.json
├── tsconfig.json
└── README.md
```

## Cost Breakdown

| Component | Cost | Notes |
|-----------|------|-------|
| **Embeddings** | Free tier / Low cost | Google AI free tier: 1,500 requests/day |
| **Vector Storage** | Free | LanceDB is local, no cloud costs |
| **Claude Responses** | $0 (subscription) | Uses Claude Code CLI with your existing subscription |
| **Gemini Responses** | Free tier / Low cost | Fallback option, uses same API key |

**This design maximizes your existing Claude subscription value** - you're already paying for Claude Pro/Team, so why pay per-token API costs too?

## Default Settings

| Setting | Default Value | Description |
|---------|---------------|-------------|
| Top K | 5 | Number of chunks to retrieve |
| Chunk Size | 100 words | Size of document chunks |
| Chunk Overlap | 20 words | Overlap between chunks |
| Responder | claude | Claude Code CLI (or gemini fallback) |

## Response Format

```typescript
interface QueryResult {
  answer: string;              // The generated response
  sources: Source[];           // Referenced document chunks
  responder: 'claude' | 'gemini';  // Which responder was used
  timing: {
    embedding: number;         // Embedding generation time (ms)
    search: number;            // Vector search time (ms)
    response: number;          // Response generation time (ms)
    total: number;             // Total processing time (ms)
  };
}
```

## Troubleshooting

### Claude Code CLI not found
```bash
# Install globally
npm install -g @anthropic-ai/claude-code

# Authenticate
claude login
```

### Fallback to Gemini automatically
If Claude Code CLI fails or isn't installed, set the fallback:
```bash
export RAG_RESPONDER="gemini"
```

### Embedding errors
Ensure your Google AI API key is valid:
```bash
curl "https://generativelanguage.googleapis.com/v1/models?key=$GOOGLE_AI_API_KEY"
```

## License

MIT
