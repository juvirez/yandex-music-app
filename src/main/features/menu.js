const { app, Menu, shell } = require("electron");
const { showOpenURLDialog } = require("../dialogs/openURL");
const { showHotkeysDialog } = require("../dialogs/hotkeys");
const navigation = require("./navigation");
const { showLoader } = require("../index");
const { traySettingsChanged } = require("./dockMenu");

const menu = Menu.buildFromTemplate([
  {
    label: app.name,
    submenu: [
      { role: "about", label: "About Yandex Music (Unofficial)" },
      {
        label: "Website",
        click() {
          shell.openExternal("https://yandex-music.juvs.dev");
        },
      },
      {
        label: "GitHub",
        click() {
          shell.openExternal("https://github.com/juvirez/yandex-music-app");
        },
      },
      { type: "separator" },
      { role: "services", submenu: [] },
      { type: "separator" },
      { role: "hide", label: "Hide Yandex Music (Unofficial)" },
      { role: "hideothers" },
      { role: "unhide" },
      { type: "separator" },
      { role: "quit", label: "Quit Yandex Music (Unofficial)" },
    ],
  },
  {
    role: "editMenu",
  },
  {
    label: "View",
    submenu: [
      {
        label: "Reload",
        accelerator: "CommandOrControl+R",
        click() {
          showLoader();
          global.mainWindow.reload();
        },
      },
      {
        role: "close",
      },
    ],
  },
  {
    label: "Navigate",
    submenu: [
      {
        label: "Back",
        accelerator: "CommandOrControl+[",
        click: navigation.goBack,
      },
      {
        label: "Forward",
        accelerator: "CommandOrControl+]",
        click: navigation.goForward,
      },
      {
        type: "separator",
      },
      {
        label: "Open URL",
        accelerator: "CommandOrControl+O",
        click: showOpenURLDialog,
      },
    ],
  },
  {
    label: "Settings",
    submenu: [
      {
        label: "Enable notifications",
        type: "checkbox",
        checked: global.store.get("notifications", true),
        click(menuItem) {
          global.store.set("notifications", menuItem.checked);
        },
      },
      {
        label: "Show Menu Bar Icon",
        type: "checkbox",
        checked: global.store.get("tray"),
        click(menuItem) {
          global.store.set("tray", menuItem.checked);
        },
      },
      {
        label: "Global Hotkeys",
        click: showHotkeysDialog,
      },
    ],
  },
  {
    role: "windowMenu",
  },
]);
Menu.setApplicationMenu(menu);
