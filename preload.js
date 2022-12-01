const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('textEditor', {
  open: () => ipcRenderer.invoke('text-editor:open'),
  sendDocument: (callback) => ipcRenderer.on('document-opened', callback),
  saveAs: ({ title, content }) =>
    ipcRenderer.send('text-editor:save-as', { title, content }),
  save: ({ title, content, openedPath }) =>
    ipcRenderer.send('text-editor:save', { title, content, openedPath }),
});
