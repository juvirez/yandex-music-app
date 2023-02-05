const { BrowserWindow, systemPreferences, dialog } = require("electron");
const { reloadShortcuts } = require("../features/hotkeys");

let win;

exports.showHotkeysDialog = () => {
  if (!systemPreferences.isTrustedAccessibilityClient(false)) {
    dialog
      .showMessageBox(global.mainWindow, {
        type: "warning",
        message: "Accessibility Access",
        detail: "To use global hotkeys, provide accessibility.",
        defaultId: 0,
        cancelId: 1,
        buttons: ["Grant Accessibility", "Not Now"],
      })
      .then((returnValue) => {
        if (returnValue.response === 0) {
          systemPreferences.isTrustedAccessibilityClient(true);
        }
      });
    return;
  }

  if (win) {
    win.hide();
    win = null;
    return;
  }

  win = new BrowserWindow({
    width: 960,
    height: 472,
    modal: true,
    parent: global.mainWindow,
    resizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
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
    reloadShortcuts();
  });

  win.loadFile("src/renderer/hotkeys/index.html");
};
