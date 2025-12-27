/**
 * Claude RAG Demo - Main Script
 * Handles file uploads, server health checks, and React component initialization
 */

// Derive API base from current location (works in dev and production)
const API_BASE = window.location.origin;

// State manager for selected files - prevents accidental mutation
const fileState = {
  _files: [],
  add(file) {
    // Dedupe by name + size + lastModified
    if (!this._files.some(f => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified)) {
      this._files.push(file);
    }
  },
  remove(index) {
    this._files.splice(index, 1);
  },
  clear() {
    this._files = [];
  },
  getAll() {
    return this._files;
  },
  get length() {
    return this._files.length;
  }
};

// File icon SVG for document listings
const FILE_ICON_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
  <polyline points="14 2 14 8 20 8"/>
</svg>`;

// Cache DOM references for status elements (queried once, used repeatedly)
const statusDom = {
  dot: document.getElementById('serverStatus'),
  text: document.getElementById('serverStatusText'),
  docCount: document.getElementById('documentCount'),
  responder: document.getElementById('responderInfo'),
};

// Set footer server link dynamically
const serverLink = document.getElementById('serverLink');
serverLink.href = `${API_BASE}/api/health`;
serverLink.textContent = new URL(API_BASE).host;

// File upload handling
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const selectedFilesDiv = document.getElementById('selectedFiles');
const uploadBtn = document.getElementById('uploadBtn');
const uploadStatus = document.getElementById('uploadStatus');

// Drag & drop events
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  handleFiles(e.dataTransfer.files);
});

dropZone.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') {
    fileInput.click();
  }
});

fileInput.addEventListener('change', (e) => {
  handleFiles(e.target.files);
});

function handleFiles(files) {
  for (const file of files) {
    fileState.add(file);
  }
  renderSelectedFiles();
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Escape HTML to prevent XSS
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderSelectedFiles() {
  const files = fileState.getAll();
  selectedFilesDiv.innerHTML = files.map((file, i) => `
    <div class="file-item">
      <span class="file-name">
        ${FILE_ICON_SVG}
        ${escapeHtml(file.name)}
      </span>
      <span class="file-size">${formatFileSize(file.size)}</span>
      <button class="remove-file" data-index="${i}" aria-label="Remove ${escapeHtml(file.name)}">✕</button>
    </div>
  `).join('');
  uploadBtn.disabled = fileState.length === 0;
}

// Remove file button - event delegation
selectedFilesDiv.addEventListener('click', (e) => {
  const btn = e.target.closest('.remove-file');
  if (btn && btn.dataset.index !== undefined) {
    fileState.remove(parseInt(btn.dataset.index, 10));
    renderSelectedFiles();
  }
});

// Upload button click handler
uploadBtn.addEventListener('click', uploadFiles);

// Parse SSE stream and return true if 'complete' event received
async function parseSSEStream(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('event: complete')) return true;
      if (line.startsWith('event: error')) return false;
    }
  }
  return false;
}

// Upload a single file via FormData, returns true on success
async function uploadSingleFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', file.name);

  const res = await fetch(`${API_BASE}/api/rag/upload/stream`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) return false;
  return parseSSEStream(res);
}

async function uploadFiles() {
  const files = fileState.getAll();
  if (files.length === 0) return;

  uploadBtn.disabled = true;
  uploadStatus.textContent = `Uploading 0/${files.length}...`;
  uploadStatus.className = 'upload-status';

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    uploadStatus.textContent = `Uploading ${i + 1}/${files.length}: ${file.name}`;

    try {
      const success = await uploadSingleFile(file);
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
    } catch (err) {
      console.error('Upload error:', err);
      errorCount++;
    }
  }

  if (errorCount === 0) {
    uploadStatus.textContent = `Uploaded ${successCount} file(s) successfully`;
    uploadStatus.className = 'upload-status success';
    fileState.clear();
    renderSelectedFiles();
    checkHealth();
  } else {
    uploadStatus.textContent = `Uploaded ${successCount}, failed ${errorCount}`;
    uploadStatus.className = 'upload-status error';
  }

  uploadBtn.disabled = fileState.length === 0;
}

// Factory to create React renderer with lazy root initialization
function createReactRenderer(containerId) {
  let root = null;
  return (Component, props) => {
    const container = document.getElementById(containerId);
    if (!container || !Component) return;
    if (!root) {
      root = ReactDOM.createRoot(container);
    }
    root.render(React.createElement(Component, props));
  };
}

// Lazy React renderers for each mount point
const renderToChat = createReactRenderer('chat-root');
const renderToAdmin = createReactRenderer('admin-root');
const renderToApiConfig = createReactRenderer('api-config-root');

// Check server health
async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    const data = await res.json();

    if (data.status === 'healthy') {
      statusDom.dot.className = 'status-dot healthy';
      statusDom.text.textContent = 'Server healthy';
    } else {
      statusDom.dot.className = 'status-dot unhealthy';
      statusDom.text.textContent = 'Server unhealthy';
    }

    statusDom.responder.textContent = `Default: ${data.responders?.default || 'none'}`;

    // Get document count (separate try-catch so health status isn't affected)
    try {
      const docsRes = await fetch(`${API_BASE}/api/rag/documents`);
      if (!docsRes.ok) {
        throw new Error(`HTTP ${docsRes.status}`);
      }
      const docsData = await docsRes.json();
      statusDom.docCount.textContent = `${docsData.count || 0} documents`;
    } catch (docErr) {
      console.warn('Failed to fetch document count:', docErr);
      statusDom.docCount.textContent = '? documents';
    }

  } catch (err) {
    statusDom.dot.className = 'status-dot unhealthy';
    statusDom.text.textContent = 'Server offline';
    statusDom.responder.textContent = '-';
    statusDom.docCount.textContent = '- documents';
  }
}

// Sample question buttons - event delegation
const sampleQuestionsDiv = document.getElementById('sampleQuestions');
sampleQuestionsDiv.addEventListener('click', (e) => {
  const btn = e.target.closest('.sample-btn');
  if (btn && btn.dataset.question) {
    askQuestion(btn.dataset.question);
  }
});

// Ask a sample question (dispatch to chat input)
function askQuestion(question) {
  const input = document.querySelector('.rag-chat-input');
  if (!input) return;

  // Use native setter to update React controlled input
  const descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
  if (!descriptor?.set) return;

  descriptor.set.call(input, question);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  // Wait for React to process state update, then click submit button
  // (form.dispatchEvent doesn't trigger React's onSubmit)
  setTimeout(() => {
    const submitBtn = document.querySelector('.rag-chat-send-button');
    if (submitBtn) {
      submitBtn.click();
    }
  }, 0);
};

// Render interface component - exported for use by init module
export function renderChat(RAGInterface) {
  const title = document.getElementById('title').value;
  const accentColor = document.getElementById('accentColor').value;
  const responder = document.getElementById('responder').value;
  const showSources = document.getElementById('showSources').value === 'true';

  renderToChat(RAGInterface, {
    endpoint: `${API_BASE}/api/rag`,
    responder: responder === 'auto' ? undefined : responder,
    chatTitle: title,
    documentsTitle: 'Document Library',
    accentColor,
    showSources,
    showDocumentLibrary: true,
    placeholder: 'Ask about your documents...'
  });
}

// Render admin dashboard
export function renderAdmin(AdminDashboard) {
  const accentColor = document.getElementById('accentColor').value;

  renderToAdmin(AdminDashboard, {
    endpoint: `${API_BASE}/api/rag`,
    accentColor,
    refreshInterval: 30000
  });
}

// Render API key config bar
export function renderApiConfig(ApiKeyConfigBar) {
  renderToApiConfig(ApiKeyConfigBar, {
    endpoint: `${API_BASE}/api/rag`
  });
}

// Tab switching
function switchTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.demo-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });

  // Update sections
  document.getElementById('chatSection').classList.toggle('active', tabName === 'chat');
  document.getElementById('adminSection').classList.toggle('active', tabName === 'admin');
}

// Initialize the demo
export function initDemo(RAGInterface, AdminDashboard, ApiKeyConfigBar) {
  // Add event listeners for controls
  ['title', 'accentColor', 'responder', 'showSources'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => {
      renderChat(RAGInterface);
      renderAdmin(AdminDashboard);
    });
  });
  document.getElementById('title').addEventListener('input', () => renderChat(RAGInterface));

  // Tab switching
  document.getElementById('chatTab').addEventListener('click', () => switchTab('chat'));
  document.getElementById('adminTab').addEventListener('click', () => switchTab('admin'));

  // Initialize
  checkHealth();
  renderChat(RAGInterface);
  renderAdmin(AdminDashboard);
  renderApiConfig(ApiKeyConfigBar);

  // Refresh health every 30 seconds
  setInterval(checkHealth, 30000);
}
