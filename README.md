# Claude RAG

A two-tier Retrieval-Augmented Generation (RAG) system using Claude AI with Voyage AI embeddings and LanceDB vector storage.

## Overview

This system provides a complete RAG pipeline with:

- **Voyage AI** for high-quality embeddings (200M free tokens)
- **LanceDB** for efficient vector storage and similarity search
- **Claude Opus 4.5** for final response generation
- **Optional Haiku compression layer** for filtering and summarizing context before Opus

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Query     │────▶│  Voyage AI   │────▶│  LanceDB    │
│             │     │  Embeddings  │     │  Vector DB  │
└─────────────┘     └──────────────┘     └─────────────┘
                                                │
                    ┌───────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Retrieved Chunks     │
        └───────────────────────┘
                    │
       ┌────────────┴────────────┐
       │                         │
       ▼                         ▼
┌─────────────────┐     ┌─────────────────┐
│  Direct Flow    │     │ Compressed Flow │
│  (Default)      │     │ (--compress)    │
└─────────────────┘     └─────────────────┘
       │                         │
       │                         ▼
       │                ┌─────────────────┐
       │                │  Haiku 3.5      │
       │                │  (Filter/Rank)  │
       │                └─────────────────┘
       │                         │
       └────────────┬────────────┘
                    │
                    ▼
          ┌─────────────────┐
          │  Opus 4.5       │
          │  (Response)     │
          └─────────────────┘
                    │
                    ▼
          ┌─────────────────┐
          │  Final Answer   │
          └─────────────────┘
```

### Two Query Modes

1. **Direct Flow** (default): Sends retrieved chunks directly to Opus 4.5 for response generation. Faster and simpler for most use cases.

2. **Compressed Flow** (`--compress`): Uses Haiku 3.5 as an intermediate layer to filter, rank, and summarize chunks before sending to Opus. Better for large contexts or when precision is critical.

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
# Required: Anthropic API key for Claude models
export ANTHROPIC_API_KEY="your-anthropic-api-key"

# Required: Voyage AI API key for embeddings
# Get one at https://dash.voyageai.com/
export VOYAGE_API_KEY="your-voyage-api-key"

# Optional: Custom Voyage model (default: voyage-3.5-lite)
export VOYAGE_MODEL="voyage-3.5-lite"

# Optional: Custom database path (default: ./data/vectors)
export RAG_DB_PATH="./data/vectors"
```

## Usage

### CLI

The CLI provides a simple interface for testing the RAG system:

```bash
# Add a document to the system
npx tsx src/cli.ts add ./docs/readme.md

# Query the system (direct flow)
npx tsx src/cli.ts query "How do I configure authentication?"

# Query with Haiku compression (better for complex queries)
npx tsx src/cli.ts query "Explain the architecture" --compress

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

// Query with default settings (direct to Opus)
const response = await query("What is this about?");
console.log(response.answer);
console.log(`Tokens used: ${response.tokensUsed.input + response.tokensUsed.output}`);

// Query with Haiku compression
const compressedResponse = await query("Explain the architecture", {
  compress: true,
  topK: 10
});
console.log(compressedResponse.answer);
console.log(`Haiku tokens: ${compressedResponse.subAgentResult?.tokensUsed}`);

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
  compress?: boolean;     // Use Haiku compression layer (default: false)
  stream?: boolean;       // Enable streaming response
  systemPrompt?: string;  // Custom system prompt for Opus
}
```

## Project Structure

```
claude-rag/
├── src/
│   ├── index.ts           # Main entry point and query function
│   ├── embeddings.ts      # Voyage AI embedding generation
│   ├── database.ts        # LanceDB vector storage
│   ├── responder.ts       # Opus response generation
│   ├── cli.ts             # Command-line interface
│   ├── config.ts          # Configuration and defaults
│   ├── types.ts           # TypeScript type definitions
│   ├── utils/
│   │   └── logger.ts      # Logging utility
│   └── subagents/
│       ├── index.ts       # Sub-agent exports
│       └── retriever.ts   # Haiku chunk filtering
├── data/
│   └── vectors/           # LanceDB storage (gitignored)
├── package.json
├── tsconfig.json
└── README.md
```

## Models Used

| Model | Purpose | Use Case |
|-------|---------|----------|
| `voyage-3.5-lite` | Embeddings | Document and query embeddings |
| `claude-haiku-4-5-20241022` | Sub-agent | Chunk filtering and compression (optional) |
| `claude-opus-4-5-20251101` | Main agent | Final response generation |

## Default Settings

| Setting | Default Value | Description |
|---------|---------------|-------------|
| Top K | 5 | Number of chunks to retrieve |
| Chunk Size | 100 words | Size of document chunks |
| Chunk Overlap | 20 words | Overlap between chunks |
| Max Tokens | 2048 | Maximum response tokens |
| Temperature | 0.7 | Response creativity |

## Response Format

```typescript
interface QueryResult {
  answer: string;              // The generated response
  sources: Source[];           // Referenced document chunks
  tokensUsed: {
    input: number;
    output: number;
  };
  subAgentResult?: {           // Only when compress=true
    relevantContext: string;
    selectedChunks: number[];
    tokensUsed: number;
    reasoning?: string;
  };
  timing: {
    embedding: number;         // Embedding generation time (ms)
    search: number;            // Vector search time (ms)
    filtering?: number;        // Haiku filtering time (ms)
    response: number;          // Opus response time (ms)
    total: number;             // Total processing time (ms)
  };
}
```

## License

MIT
