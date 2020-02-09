const { app, BrowserWindow } = require("electron");
const path = require("path");

let win;
let willQuitApp = false;

app.on("before-quit", () => (willQuitApp = true));
app.on("activate", () => {
  if (win) {
    win.show();
  }
});

app.on("ready", () => {
  win = new BrowserWindow({
    width: 1301,
    height: 768,
    title: "Яндекс.Музыка",
    webPreferences: {
      preload: path.join(__dirname, "../renderer/preload.js")
    }
  });
  win.loadURL("https://music.yandex.ru");
  global.mainWindow = win;

  require("./features");

  win.on("close", e => {
    if (willQuitApp) {
      win = null;
    } else {
      e.preventDefault();
      win.hide();
    }
  });

  win.on("focus", () => {
    win.webContents.send("windowFocus");
  });
});
