# Claude RAG

**Chat with your documents using AI.** Upload PDFs, Word docs, or text files and ask questions about them.

---

## What is this?

You have documents. You want to ask questions about them. This app lets you do that.

```
You: "What does the contract say about payment terms?"
App: "According to section 4.2, payment is due within 30 days..."
```

It runs on your computer. Your files stay private.

---

## Get Started (3 steps)

### Step 1: Install

Open your terminal (Command Prompt on Windows, Terminal on Mac) and run:

```bash
npx degit creativeprofit22/Claude-RAG my-rag-app
cd my-rag-app
npm install
```

### Step 2: Add your API key

You need a free Google AI key to make it work.

1. Go to https://aistudio.google.com/apikey
2. Click "Create API Key"
3. Copy the key (starts with `AIza...`)

Now create a file called `.env` in your project folder:

```bash
GOOGLE_AI_API_KEY=paste-your-key-here
```

### Step 3: Run it

```bash
npm run dev
```

Open your browser to **http://localhost:3000**

That's it! Upload documents and start chatting.

---

## Options

Put these in your `.env` file if needed:

```bash
# Your API key (required)
GOOGLE_AI_API_KEY=AIza...

# Change the port (optional, default is 3000)
PORT=8080
```

---

## Need a different port?

If port 3000 is already in use:

```bash
PORT=8080 npm run dev
```

Now open **http://localhost:8080** instead.

---

## What files can I upload?

- PDF files
- Word documents (.docx)
- Text files (.txt)
- Excel spreadsheets (.xlsx, .csv)

---

## How it works (simple version)

1. You upload a document
2. The app breaks it into small pieces
3. When you ask a question, it finds the relevant pieces
4. AI reads those pieces and answers your question

---

## Troubleshooting

**"npm not found"**
→ Install Node.js first: https://nodejs.org (download the LTS version)

**"Port 3000 already in use"**
→ Use a different port: `PORT=8080 npm run dev`

**"Invalid API key"**
→ Make sure you copied the full key starting with `AIza`

**App won't start**
→ Make sure you created the `.env` file with your API key

---

## For Developers

<details>
<summary>Click to expand technical details</summary>

### Architecture

```
Query → Gemini Embeddings → LanceDB → Relevant Chunks → Claude/Gemini → Response
```

### Tech Stack

- **Embeddings**: Google Gemini
- **Vector DB**: LanceDB (local)
- **Responses**: Claude Code CLI (your subscription) or Gemini (fallback)
- **Server**: Bun
- **UI**: React

### Environment Variables

```bash
GOOGLE_AI_API_KEY=xxx        # Required - for embeddings
PORT=3000                    # Optional - server port
RAG_DB_PATH=./data/vectors   # Optional - database location
GEMINI_EMBEDDING_DIM=1024    # Optional - embedding dimensions
```

### React Components

```tsx
import { RAGChat } from 'claude-rag/react';
import 'claude-rag/react/styles.css';

<RAGChat endpoint="/api/rag/query" />
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/rag/query` | POST | Ask a question |
| `/api/rag/upload` | POST | Upload a document |
| `/api/rag/documents` | GET | List all documents |
| `/api/rag/documents/:id` | DELETE | Delete a document |
| `/api/responders` | GET | Check available AI responders |

### Programmatic Usage

```typescript
import { query, addDocument } from 'claude-rag';

await addDocument("Your text here", { name: "doc.txt" });
const result = await query("What is this about?");
console.log(result.answer);
```

</details>

---

## License

MIT - do whatever you want with it.
