const { BrowserWindow, clipboard, ipcMain } = require("electron");

let win;

exports.showOpenURLDialog = () => {
  if (win) {
    win.hide();
    win = null;
    return;
  }

  win = createWindow();
  win.once("ready-to-show", () => {
    let clipboardString = clipboard.readText("selection");
    if (clipboardString.startsWith("https://music.yandex.ru")) {
      win.webContents.send("url", clipboardString);
    }
    win.show();
  });
  win.once("blur", () => {
    if (win) {
      win.hide();
      win = null;
    }
  });
  win.on("closed", () => {
    win = null;
  });
};

ipcMain.on("navigate", (_event, url) => {
  global.mainWindow.webContents.send("navigate", url);
  if (win) {
    win.close();
  }
});

function createWindow() {
  let win = new BrowserWindow({
    width: 440,
    height: 117,
    modal: true,
    parent: global.mainWindow,
    resizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.loadFile("src/renderer/openURL.html");
  return win;
}
