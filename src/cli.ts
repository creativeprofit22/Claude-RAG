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
  addDocument,
  listDocuments,
  deleteDocument,
  isReady
} from './index.js';
import { logger } from './utils/logger.js';

const COMMANDS = ['add', 'query', 'list', 'delete', 'status', 'help'] as const;
type Command = typeof COMMANDS[number];

function printUsage(): void {
  console.log(`
Claude RAG CLI - Two-tier RAG system with Haiku sub-agents and Opus main agent

Usage:
  npx tsx src/cli.ts <command> [arguments]

Commands:
  add <file>         Add a document to the RAG system
  query <question>   Query the RAG system
  list               List all documents
  delete <id>        Delete a document by ID
  status             Check if the system is ready
  help               Show this help message

Options:
  --topK <n>         Number of chunks to retrieve (default: 5)
  --compress         Use Haiku to filter/summarize chunks before Opus (slower, better for large contexts)
  --verbose          Enable verbose logging

Query Modes:
  Default:           Direct to Opus - faster and simpler, sends raw chunks directly
  With --compress:   Via Haiku first - filters and summarizes chunks before Opus responds

Examples:
  npx tsx src/cli.ts add ./docs/readme.md
  npx tsx src/cli.ts query "How do I configure the system?"
  npx tsx src/cli.ts query "How does X work?" --compress
  npx tsx src/cli.ts list
  npx tsx src/cli.ts delete doc_1234567890
  npx tsx src/cli.ts status
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
    console.log('  - Ollama: Connected');
    console.log('  - Embedding model: Available');
    console.log('  - Vector DB: Initialized');
  } else {
    console.log('System Status: NOT READY');
    console.log(`  Error: ${status.error}`);
    console.log('\nTroubleshooting:');
    console.log('  1. Make sure Ollama is running: ollama serve');
    console.log('  2. Pull the embedding model: ollama pull nomic-embed-text');
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
