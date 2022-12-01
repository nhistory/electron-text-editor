const editorContent = document.getElementById('editor-content'),
  editorHeader = document.getElementById('editor-header'),
  editorTitle = document.getElementById('editor-title'),
  editorBody = document.getElementById('editor-body'),
  editorInput = document.getElementById('editor-input');

function toggleHeaderShadow() {
  const scrollTop = editorInput.scrollTop;
  if (scrollTop > 0) {
    editorHeader.classList.add('is-overlapping');
    editorBody.style.backgroundPosition = '0 ' + -scrollTop + 'px';
  } else {
    editorHeader.classList.remove('is-overlapping');
    editorBody.style.backgroundPosition = '0 0';
  }
}

let openedPath;

// Make new txt file
function removeText() {
  localStorage.clear();
  editorTitle.value = '';
  editorInput.value = '';
  openedPath = '';
}

// Open txt file existed
function openText() {
  window.textEditor.open();
}

window.textEditor.sendDocument(async (_event, value) => {
  console.log(value);
  editorTitle.value = value.title;
  editorInput.value = value.content;
  openedPath = value.filePath;
});

// Save txt file
function saveText() {
  const title = editorTitle.value;
  const content = editorInput.value;
  if (!openedPath) {
    window.textEditor.saveAs({ title, content });
  } else {
    window.textEditor.save({ title, content, openedPath });
  }
}

// Save as txt file
function saveAsText() {
  const title = editorTitle.value;
  const content = editorInput.value;
  window.textEditor.saveAs({ title, content });
}

function saveToLocalStorage() {
  const documentTitle = editorTitle.value;
  const documentContent = editorInput.value;
  localStorage.setItem('title', documentTitle);
  localStorage.setItem('content', documentContent);
}

function loadFromLocalStorage() {
  if (localStorage.content) {
    editorInput.value = localStorage.content;
  }
  if (localStorage.title) {
    editorTitle.value = localStorage.title;
  }
}

editorTitle.addEventListener('input', saveToLocalStorage);
editorInput.addEventListener('scroll', toggleHeaderShadow);
editorInput.addEventListener('input', saveToLocalStorage);
window.addEventListener('load', loadFromLocalStorage);
