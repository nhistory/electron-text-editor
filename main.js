const {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  nativeTheme,
} = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('index.html');

  // hide main menu
  //mainWindow.setMenuBarVisibility(false);

  // dark mode
  nativeTheme.themeSource = 'dark';

  ipcMain.handle('text-editor:open', () => {
    dialog
      .showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'text files', extensions: ['txt'] }],
      })
      .then(({ filePaths }) => {
        const filePath = filePaths[0];

        console.log(filePath);
        openFile(filePath);
      });
  });
};

const openFile = (filePath) => {
  const title = path.basename(filePath, path.extname(filePath));
  fs.readFile(filePath, 'utf8', (error, content) => {
    console.log(content);
    //app.addRecentDocument(filePath);
    //openedFilePath = filePath;
    mainWindow.webContents.send('document-opened', { title, content });
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
