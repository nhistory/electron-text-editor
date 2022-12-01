const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('textEditor', {
  open: () => ipcRenderer.invoke('text-editor:open'),
  sendDocument: (callback) => ipcRenderer.on('document-opened', callback),
});
