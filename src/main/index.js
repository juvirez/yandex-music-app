const { app, BrowserWindow, BrowserView } = require("electron");
const path = require("path");
const settings = require("electron-settings");

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
    },
  });
  const windowBounds = settings.get("window.bounds", { width: defaultWindowWidth, height: defaultWindowHeight });
  win.setBounds(windowBounds);

  exports.showLoader();
  win.loadURL("https://music.yandex.ru");
  global.mainWindow = win;

  require("./features");

  win.on("close", (e) => {
    if (willQuitApp) {
      settings.set("window.bounds", win.getBounds());
      win = null;
    } else {
      e.preventDefault();
      win.hide();
    }
  });
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
