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

function removeText() {
  localStorage.clear();
  editorTitle.value = '';
  editorInput.value = '';
}

function openText() {
  window.textEditor.open();
}

window.textEditor.sendDocument(async (_event, value) => {
  editorTitle.value = value.title;
  editorInput.value = value.content;
});

function saveTextAsFile() {
  const documentContent = editorInput.value;
  const textFileAsBlob = new Blob([documentContent], {
    type: 'text/plain',
  });
  const fileNameToSaveAs = editorTitle.value
    ? editorTitle.value
    : 'Untitled Note';
  const downloadLink = document.createElement('a');
  downloadLink.download = fileNameToSaveAs;
  downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
  document
    .getElementsByClassName('editor-binding')[0]
    .appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
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
