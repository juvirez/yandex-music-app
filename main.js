const {app, BrowserWindow, globalShortcut} = require('electron')
  
  let win
  
  function createWindow () {
    win = new BrowserWindow({width: 800, height: 600})
    win.loadFile('index.html')
    // win.webContents.openDevTools()
    win.on('closed', () => {
      win = null
    })
  }

  app.on('ready', () => {
    createWindow()

    for (const shortcut of ['MediaNextTrack', 'MediaPreviousTrack', 'MediaStop', 'MediaPlayPause']) {
      globalShortcut.register(shortcut, () => {
        win.webContents.send('mediaShortcut', shortcut);
      });
    }
  })
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    if (win === null) {
      createWindow()
    }
  })