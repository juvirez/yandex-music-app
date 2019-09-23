const { BrowserWindow } = require("electron");

let win;

exports.showHotkeysDialog = () => {
  if (win) {
    win.hide();
    win = null;
    return;
  }

  win = new BrowserWindow({
    width: 500,
    height: 300,
    modal: true,
    parent: global.mainWindow,
    resizable: false,
    show: false
  });

  win.once("ready-to-show", () => {
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

  win.loadFile("src/renderer/hotkeys/index.html");
};
