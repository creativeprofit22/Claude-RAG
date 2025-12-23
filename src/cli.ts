#!/usr/bin/env node
/**
 * Claude RAG CLI - Test script for the RAG system
 *
 * Usage:
 *   npx tsx src/cli.ts add <file>       - Add a document
 *   npx tsx src/cli.ts query <question> - Query the RAG system
 *   npx tsx src/cli.ts list             - List all documents
 *   npx tsx src/cli.ts delete <id>      - Delete a document
 *   npx tsx src/cli.ts status           - Check system status
 */

import { readFileSync, existsSync } from 'fs';
import { basename } from 'path';
import {
  query,
  search,
  addDocument,
  listDocuments,
  deleteDocument,
  isReady
} from './index.js';
import { logger } from './utils/logger.js';

const COMMANDS = ['add', 'search', 'query', 'list', 'delete', 'status', 'help'] as const;
type Command = typeof COMMANDS[number];

function printUsage(): void {
  console.log(`
Claude RAG CLI - Vector search with Google Gemini embeddings

Usage:
  npx tsx src/cli.ts <command> [arguments]

Commands:
  add <file>         Add a document to the RAG system
  search <question>  Search and get context (for Claude Code CLI - NO API costs)
  query <question>   Full RAG query with LLM response (requires Anthropic API)
  list               List all documents
  delete <id>        Delete a document by ID
  status             Check if the system is ready
  help               Show this help message

Options:
  --topK <n>         Number of chunks to retrieve (default: 5)
  --compress         Use Haiku to filter/summarize chunks before Opus (query only)
  --verbose          Enable verbose logging

Search vs Query:
  search:  Returns context only (Google Gemini + LanceDB) - FREE with your monthly plan
  query:   Full LLM response (requires Anthropic API key) - PAID API usage

Examples:
  npx tsx src/cli.ts add ./docs/readme.md
  npx tsx src/cli.ts search "How do I configure the system?"
  npx tsx src/cli.ts search "What is X?" --topK 10
  npx tsx src/cli.ts list
  npx tsx src/cli.ts delete doc_1234567890
`);
}

async function handleAdd(filePath: string): Promise<void> {
  if (!existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  console.log(`Reading file: ${filePath}`);
  const text = readFileSync(filePath, 'utf-8');
  const name = basename(filePath);

  console.log(`Adding document: ${name} (${text.length} characters)`);
  const result = await addDocument(text, {
    name,
    source: filePath,
    type: filePath.split('.').pop()
  });

  console.log(`\nDocument added successfully!`);
  console.log(`  ID: ${result.documentId}`);
  console.log(`  Chunks: ${result.chunks}`);
}

/**
 * Search-only handler - returns context for use in Claude Code CLI
 * NO Anthropic API calls - just Google Gemini embeddings + LanceDB search
 */
async function handleSearch(question: string, options: { topK?: number }): Promise<void> {
  console.error(`\nSearching: "${question}"\n`);

  const result = await search(question, { topK: options.topK });

  if (result.chunks.length === 0) {
    console.log('No relevant documents found. Add some documents first with: npx tsx src/cli.ts add <file>');
    return;
  }

  // Output the context (ready to paste into Claude Code)
  console.log('# Retrieved Context\n');
  console.log(result.context);
  console.log('\n---\n');

  // Stats to stderr so they don't pollute the context output
  console.error(`Found ${result.chunks.length} relevant chunks`);
  console.error(`Timing: embedding=${result.timing.embedding}ms, search=${result.timing.search}ms, total=${result.timing.total}ms`);
  console.error('\nCopy the context above and use it in Claude Code CLI.');
}

async function handleQuery(question: string, options: { topK?: number; compress?: boolean }): Promise<void> {
  const useCompression = options.compress ?? false;

  console.log(`\nQuerying: "${question}"`);
  console.log(`Mode: ${useCompression ? 'Haiku compression -> Opus' : 'Direct to Opus'}\n`);
  console.log('---');

  const startTime = Date.now();
  const result = await query(question, {
    topK: options.topK,
    compress: useCompression
  });

  console.log('\nAnswer:');
  console.log(result.answer);

  console.log('\n---');
  console.log('\nSources:');
  if (result.sources.length === 0) {
    console.log('  No sources found');
  } else {
    result.sources.forEach((source, i) => {
      console.log(`  ${i + 1}. ${source.documentName} (chunk ${source.chunkIndex})`);
      console.log(`     ${source.snippet}`);
    });
  }

  console.log('\n---');
  console.log('\nTiming:');
  console.log(`  Embedding:  ${result.timing.embedding}ms`);
  console.log(`  Search:     ${result.timing.search}ms`);
  if (useCompression) {
    console.log(`  Filtering:  ${result.timing.filtering}ms (Haiku: ${result.subAgentResult?.tokensUsed ?? 0} tokens)`);
  } else {
    console.log(`  Filtering:  skipped (Haiku: not used)`);
  }
  console.log(`  Response:   ${result.timing.response}ms (Opus: ${result.tokensUsed.input + result.tokensUsed.output} tokens)`);
  console.log(`  Total:      ${result.timing.total}ms`);
}

async function handleList(): Promise<void> {
  console.log('\nDocuments in RAG system:\n');

  const docs = await listDocuments();

  if (docs.length === 0) {
    console.log('  No documents found. Use "add" command to add documents.');
    return;
  }

  docs.forEach((docId, i) => {
    console.log(`  ${i + 1}. ${docId}`);
  });

  console.log(`\nTotal: ${docs.length} document(s)`);
}

async function handleDelete(documentId: string): Promise<void> {
  console.log(`Deleting document: ${documentId}`);

  await deleteDocument(documentId);

  console.log('Document deleted successfully!');
}

async function handleStatus(): Promise<void> {
  console.log('\nChecking system status...\n');

  const status = await isReady();

  if (status.ready) {
    console.log('System Status: READY');
    console.log('  - Google Gemini: Connected');
    console.log('  - Embedding model: gemini-embedding-001');
    console.log('  - Vector DB: LanceDB initialized');
  } else {
    console.log('System Status: NOT READY');
    console.log(`  Error: ${status.error}`);
    console.log('\nTroubleshooting:');
    console.log('  1. Check GOOGLE_AI_API_KEY in .env file');
    console.log('  2. Get a key at: https://aistudio.google.com/apikey');
  }
}

function parseArgs(args: string[]): { command: Command; args: string[]; options: Record<string, string | number | boolean> } {
  const options: Record<string, string | number | boolean> = {};
  const positional: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const nextArg = args[i + 1];

      if (nextArg && !nextArg.startsWith('--')) {
        // Check if it's a number
        const num = parseFloat(nextArg);
        options[key] = isNaN(num) ? nextArg : num;
        i++;
      } else {
        options[key] = true;
      }
    } else {
      positional.push(arg);
    }
  }

  const command = (positional[0] || 'help') as Command;

  if (!COMMANDS.includes(command)) {
    console.error(`Unknown command: ${command}`);
    console.log(`Available commands: ${COMMANDS.join(', ')}`);
    process.exit(1);
  }

  return {
    command,
    args: positional.slice(1),
    options
  };
}

async function main(): Promise<void> {
  const { command, args, options } = parseArgs(process.argv.slice(2));

  // Set log level based on verbose flag
  if (options.verbose) {
    logger.setLevel('debug');
  }

  try {
    switch (command) {
      case 'add':
        if (args.length === 0) {
          console.error('Error: Please provide a file path');
          console.log('Usage: npx tsx src/cli.ts add <file>');
          process.exit(1);
        }
        await handleAdd(args[0]);
        break;

      case 'search':
        if (args.length === 0) {
          console.error('Error: Please provide a search query');
          console.log('Usage: npx tsx src/cli.ts search <question>');
          process.exit(1);
        }
        await handleSearch(args.join(' '), {
          topK: typeof options.topK === 'number' ? options.topK : undefined
        });
        break;

      case 'query':
        if (args.length === 0) {
          console.error('Error: Please provide a question');
          console.log('Usage: npx tsx src/cli.ts query <question>');
          process.exit(1);
        }
        await handleQuery(args.join(' '), {
          topK: typeof options.topK === 'number' ? options.topK : undefined,
          compress: options.compress === true
        });
        break;

      case 'list':
        await handleList();
        break;

      case 'delete':
        if (args.length === 0) {
          console.error('Error: Please provide a document ID');
          console.log('Usage: npx tsx src/cli.ts delete <id>');
          process.exit(1);
        }
        await handleDelete(args[0]);
        break;

      case 'status':
        await handleStatus();
        break;

      case 'help':
      default:
        printUsage();
        break;
    }
  } catch (error) {
    console.error('\nError:', error instanceof Error ? error.message : error);
    if (options.verbose && error instanceof Error) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

main();
