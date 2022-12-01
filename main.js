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
  mainWindow.setMenuBarVisibility(false);

  // dark mode
  nativeTheme.themeSource = 'dark';

  // show dialog window to open txt file
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

  // show dialog window to save txt file
  // https://www.geeksforgeeks.org/save-files-in-electronjs/
  ipcMain.on('text-editor:save-as', (event, { title, content }) => {
    console.log(title, content);

    dialog
      .showSaveDialog({
        title: 'Select the File Path to save',
        defaultPath: path.join(__dirname, './'),
        buttonLabel: 'Save',
        filters: [
          {
            name: 'Text Files',
            extensions: 'txt',
          },
        ],
        properties: [],
      })
      .then((file) => {
        console.log(file.canceled);
        if (!file.canceled) {
          console.log(file.filePath.toString());

          fs.writeFile(file.filePath.toString(), content, (err) => {
            if (err) throw err;
            console.log('Saved!');
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  // save txt file without showing dialog window
  ipcMain.on('text-editor:save', (event, { title, content, openedPath }) => {
    console.log(title, content, openedPath);
    fs.writeFile(openedPath, content, (err) => {
      if (err) throw err;
      console.log('Saved!');
    });
  });
};

const openFile = (filePath) => {
  const title = path.basename(filePath, path.extname(filePath));
  fs.readFile(filePath, 'utf8', (error, content) => {
    console.log(content);
    //app.addRecentDocument(filePath);
    //openedFilePath = filePath;
    mainWindow.webContents.send('document-opened', {
      title,
      content,
      filePath,
    });
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
