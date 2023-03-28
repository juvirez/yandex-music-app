const { app, BrowserWindow, BrowserView, ipcMain, nativeTheme } = require("electron");
const path = require("path");
const Store = require("electron-store");

let i18n = new (require("./locales/i18n"))();

const defaultWindowWidth = 1301;
const defaultWindowHeight = 768;

let win;
let willQuitApp = false;
let initialUrl = "https://music.yandex.ru";

app.commandLine.appendSwitch("disable-features", "HardwareMediaKeyHandling,MediaSessionService");
process.on("uncaughtException", console.error);

app.on("before-quit", () => (willQuitApp = true));
app.on("activate", () => {
  if (win) {
    win.show();
  }
});

app.on("ready", () => {
  win = new BrowserWindow({
    title: i18n.__("App Name"),
    minHeight: 200,
    minWidth: 400,
    backgroundColor: getWindowBackgroudColor(),
    webPreferences: {
      contextIsolation: false,
      preload: path.join(__dirname, "../renderer/preload.js"),
    },
  });
  app.setAboutPanelOptions({
    applicationName: i18n.__("App Name"),
    //version: app.getVersion, // TODO: show git revision
  });

  const store = new Store();
  ipcMain.handle("getStoreValue", (_event, key, defaultValue) => {
    return store.get(key, defaultValue);
  });
  ipcMain.handle("setStoreValue", (_event, key, value) => {
    return store.set(key, value);
  });
  const windowBounds = store.get("window.bounds", { width: defaultWindowWidth, height: defaultWindowHeight });
  win.setBounds(windowBounds);

  exports.showLoader();
  win.loadURL(initialUrl);
  
  global.mainWindow = win;
  global.store = store;

  require("./features");

  win.on("close", (e) => {
    if (willQuitApp) {
      const bounds = win.getBounds();
      if (bounds.width > 400 && bounds.height > 200) {
        store.set("window.bounds", bounds);
      }
      win = null;
    } else {
      e.preventDefault();
      if (win.isFullScreen()) {
        win.once('leave-full-screen', () => win.hide())
        win.setFullScreen(false)
      } else {
        win.hide()
      }      
    }
  });
});

app.setAsDefaultProtocolClient("yandex-music-app");

app.on("open-url", (event, url) => {
  event.preventDefault();
  initialUrl = url;
  const path = url
    .replace('yandex-music-app:/', '')
    .replace('https://music.yandex.ru/', '');
  global.mainWindow.loadURL("https://music.yandex.ru/" + path);
});

exports.showLoader = () => {
  let view = new BrowserView();
  win.setBrowserView(view);
  let [width, height] = win.getSize();
  view.setBounds({ x: 0, y: 0, width: width, height: height });
  view.setAutoResize({ width: true, height: true, horizontal: true, vertical: true });
  view.webContents.loadFile("src/renderer/loader.html");

  const timoutId = setTimeout(() => {
    win.removeBrowserView(view);
  }, 10000);

  ipcMain.once("playerIsReady", () => {
    win.removeBrowserView(view);
    clearTimeout(timoutId);
  });
};

function getWindowBackgroudColor() {
  if (nativeTheme.shouldUseDarkColors) {
    return "#181818";
  } else {
    return "#ffffff";
  }
}