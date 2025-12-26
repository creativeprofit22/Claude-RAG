/**
 * Claude RAG Demo - Main Script
 * Handles file uploads, server health checks, and React component initialization
 */

// Derive API base from current location (works in dev and production)
const API_BASE = window.location.origin;
let selectedFiles = [];

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
    // Dedupe by name + size + lastModified to allow same-named files from different directories
    if (!selectedFiles.some(f => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified)) {
      selectedFiles.push(file);
    }
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
  selectedFilesDiv.innerHTML = selectedFiles.map((file, i) => `
    <div class="file-item">
      <span class="file-name">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        ${escapeHtml(file.name)}
      </span>
      <span class="file-size">${formatFileSize(file.size)}</span>
      <button class="remove-file" onclick="removeFile(${i})">✕</button>
    </div>
  `).join('');
  uploadBtn.disabled = selectedFiles.length === 0;
}

window.removeFile = function(index) {
  selectedFiles.splice(index, 1);
  renderSelectedFiles();
};

window.uploadFiles = async function() {
  if (selectedFiles.length === 0) return;

  uploadBtn.disabled = true;
  uploadStatus.textContent = `Uploading 0/${selectedFiles.length}...`;
  uploadStatus.className = 'upload-status';

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];
    uploadStatus.textContent = `Uploading ${i + 1}/${selectedFiles.length}: ${file.name}`;

    try {
      // Use FormData for binary file support (PDF, XLSX, DOCX, etc.)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name);

      const res = await fetch(`${API_BASE}/api/rag/upload/stream`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        errorCount++;
        continue;
      }

      // Read SSE stream for progress (simplified - just wait for completion)
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let uploadSucceeded = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('event: complete')) {
            uploadSucceeded = true;
          } else if (line.startsWith('event: error')) {
            uploadSucceeded = false;
          }
        }
      }

      if (uploadSucceeded) {
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
    selectedFiles = [];
    renderSelectedFiles();
    checkHealth();
  } else {
    uploadStatus.textContent = `Uploaded ${successCount}, failed ${errorCount}`;
    uploadStatus.className = 'upload-status error';
  }

  uploadBtn.disabled = selectedFiles.length === 0;
};

// Create React root once to prevent memory leak and state loss
let chatRoot = null;

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

// Ask a sample question (dispatch to chat input)
window.askQuestion = function(question) {
  const input = document.querySelector('.rag-chat-input');
  if (input) {
    // Use native setter to update React controlled input
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(input, question);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    // Wait for React to process state update, then click submit button
    // (form.dispatchEvent doesn't trigger React's onSubmit)
    setTimeout(() => {
      const submitBtn = document.querySelector('.rag-chat-send-button');
      if (submitBtn) {
        submitBtn.click();
      }
    }, 0);
  }
};

// Render interface component - exported for use by init module
export function renderChat(RAGInterface) {
  const title = document.getElementById('title').value;
  const accentColor = document.getElementById('accentColor').value;
  const responder = document.getElementById('responder').value;
  const showSources = document.getElementById('showSources').value === 'true';

  // RAGInterface uses base endpoint, adds /query internally
  const endpoint = responder === 'auto'
    ? `${API_BASE}/api/rag`
    : `${API_BASE}/api/rag?responder=${responder}`;

  // Create root only once to preserve state across re-renders
  if (!chatRoot) {
    chatRoot = ReactDOM.createRoot(document.getElementById('chat-root'));
  }
  chatRoot.render(
    React.createElement(RAGInterface, {
      endpoint,
      chatTitle: title,
      documentsTitle: 'Document Library',
      accentColor,
      showSources,
      showDocumentLibrary: true,
      placeholder: 'Ask about your documents...'
    })
  );
}

// Admin dashboard root
let adminRoot = null;

// Render admin dashboard
export function renderAdmin(AdminDashboard) {
  const adminContainer = document.getElementById('admin-root');
  if (!adminContainer || !AdminDashboard) return;

  const accentColor = document.getElementById('accentColor').value;

  if (!adminRoot) {
    adminRoot = ReactDOM.createRoot(adminContainer);
  }
  adminRoot.render(
    React.createElement(AdminDashboard, {
      endpoint: `${API_BASE}/api/rag`,
      accentColor,
      refreshInterval: 30000
    })
  );
}

// Initialize the demo
export function initDemo(RAGInterface, AdminDashboard) {
  // Add event listeners for controls
  ['title', 'accentColor', 'responder', 'showSources'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => {
      renderChat(RAGInterface);
      renderAdmin(AdminDashboard);
    });
  });
  document.getElementById('title').addEventListener('input', () => renderChat(RAGInterface));

  // Initialize
  checkHealth();
  renderChat(RAGInterface);
  renderAdmin(AdminDashboard);

  // Refresh health every 30 seconds
  setInterval(checkHealth, 30000);
}
