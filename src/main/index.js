const { app, BrowserWindow, BrowserView, ipcMain } = require("electron");
const path = require("path");
const Store = require("electron-store");

const defaultWindowWidth = 1301;
const defaultWindowHeight = 768;

let win;
let willQuitApp = false;

app.commandLine.appendSwitch("disable-features", "HardwareMediaKeyHandling,MediaSessionService");
process.on('uncaughtException', console.error);

app.on("before-quit", () => (willQuitApp = true));
app.on("activate", () => {
  if (win) {
    win.show();
  }
});

app.on("ready", () => {
  win = new BrowserWindow({
    title: "Яндекс.Музыка",
    webPreferences: {
      contextIsolation: false,
      preload: path.join(__dirname, "../renderer/preload.js"),
      backgroundThrottling: false,
    },
  });

  const store = new Store();
  ipcMain.handle('getStoreValue', (_event, key, defaultValue) => {
    return store.get(key, defaultValue);
  });
  ipcMain.handle('setStoreValue', (_event, key, value) => {
    return store.set(key, value);
  });
  const windowBounds = store.get("window.bounds", { width: defaultWindowWidth, height: defaultWindowHeight });
  win.setBounds(windowBounds);

  exports.showLoader();
  win.loadURL("https://music.yandex.ru");
  
  global.mainWindow = win;
  global.trayPopUpWindow = initializeTrayPopUpWindow();
  global.store = store;

  require("./features");

  win.on("close", (e) => {
    if (willQuitApp) {
      store.set("window.bounds", win.getBounds());
      win = null;
    } else {
      e.preventDefault();
      win.hide();
    }
  });
});

function initializeTrayPopUpWindow() {
    let trayPopUpWindow = new BrowserWindow({
        title: "Яндекс.Музыка",
        width: 168,
        height: 200,
        show: false,
        frame: false,
        fullscreenable: false,
        resizable: false,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, "../renderer/trayPopUpPreload.js"),
            backgroundThrottling: false,
            nodeIntegration: false,
            enableRemoteModule: false,
        }
    });
    trayPopUpWindow.on("blur", trayPopUpWindow.hide);
    trayPopUpWindow.loadFile('src/renderer/trayPopUp.html');
    ipcMain.on("playerCmd", (_event, data) => {
        win.webContents.send("playerCmd", data);
    });
    ipcMain.on("changeTrack", (_event, data) => {
        trayPopUpWindow.webContents.send("changeTrack", data);
    });
    ipcMain.on("changeTrack", (_event, data) => {
      trayPopUpWindow.webContents.send("changeTrack", data);
    });
    ipcMain.on("initControls", (_event, {currentTrack, controls}) => {
        trayPopUpWindow.webContents.send("initControls", {currentTrack, controls});
    });
    ipcMain.on("changeControls", (_event, {currentTrack, controls}) => {
        trayPopUpWindow.webContents.send("changeControls", {currentTrack, controls});
    });
    ipcMain.on("changeState", (_event, {isPlaying, currentTrack}) => {
        trayPopUpWindow.webContents.send("changeState", {isPlaying, currentTrack});
    });

    return trayPopUpWindow;
}

app.setAsDefaultProtocolClient("yandex-music-app");

app.on("open-url", (event, url) => {
  event.preventDefault();
  global.mainWindow.loadURL("https://music.yandex.ru/" + url.replace('yandex-music-app:/', ''));
});

exports.showLoader = () => {
  let view = new BrowserView();
  win.setBrowserView(view);
  let [width, height] = win.getSize();
  view.setBounds({ x: 0, y: 0, width: width, height: height });
  view.setAutoResize({ width: true, height: true, horizontal: true, vertical: true });
  view.webContents.loadFile("src/renderer/loader.html");

  win.webContents.once("dom-ready", () => {
    win.removeBrowserView(view);
  });
};
