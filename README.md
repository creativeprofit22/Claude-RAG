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

First, you need **Node.js** installed. Download it from https://nodejs.org (pick the LTS version).

Then open your terminal:
- **Windows**: Press `Win + R`, type `cmd`, press Enter
- **Mac**: Press `Cmd + Space`, type `Terminal`, press Enter
- **Linux/WSL**: Open your terminal app

Run these commands:

```bash
npx degit creativeprofit22/Claude-RAG my-rag-app
cd my-rag-app
npm install
```

### Step 2: Get your API key

You need a free Google AI key to make it work.

1. Go to https://aistudio.google.com/apikey
2. Click "Create API Key"
3. Copy the key (starts with `AIza...`)

> **Free tier**: 1,000 requests/day (resets at midnight). That's plenty for personal use!

You can add it **two ways**:

**Option A: In the app (easiest)**
- Just run the app (Step 3)
- Click the Settings gear icon
- Paste your key there

**Option B: In a file**
- Create a file called `.env` in your project folder:
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
# Pick any number you want: 3000, 4000, 8080, 9000, etc.
PORT=3000
```

---

## Need a different port?

If port 3000 is busy, pick any other number you like:

```bash
# Examples - use whichever port you want
PORT=4000 npm run dev
PORT=8080 npm run dev
PORT=9000 npm run dev
```

Then open `http://localhost:YOUR_NUMBER` in your browser.

---

## What files can I upload?

- MD files
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

## Want better answers? Use Claude (optional)

By default, the app uses Gemini to answer questions. But if you have a **Claude Pro subscription**, you can use Claude instead for higher quality responses.

### Setup Claude Code CLI

1. Install it:
```bash
npm install -g @anthropic-ai/claude-code
```

2. Log in (opens browser):
```bash
claude login
```

That's it! The app will automatically detect Claude and use it for responses.

> **Note**: Claude Code CLI requires a Claude Pro, Team, or Enterprise subscription. If you don't have one, Gemini works great too!

---

## Troubleshooting

**"npm not found" or "node not found"**
→ Install Node.js first: https://nodejs.org (download the LTS version)
→ After installing, close and reopen your terminal

**"Port 3000 already in use"**
→ Something else is using that port. Pick a different number:
→ `PORT=4000 npm run dev` (or any number you like)

**"Invalid API key"**
→ Make sure you copied the full key starting with `AIza`
→ Check there are no extra spaces before or after the key

**App won't start**
→ Make sure you created the `.env` file in the project folder
→ Make sure it has `GOOGLE_AI_API_KEY=your-key-here`

**"Permission denied" (Linux/Mac)**
→ Try: `sudo npm install`

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
