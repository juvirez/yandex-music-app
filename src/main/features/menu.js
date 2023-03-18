const { app, Menu, shell, MenuItem, clipboard } = require("electron");
const { showOpenURLDialog } = require("../dialogs/openURL");
const { showHotkeysDialog } = require("../dialogs/hotkeys");
const navigation = require("./navigation");
const { showLoader } = require("../index");
const { getTrackMetaData } = require("./playerMetaData");

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
      { type: "separator" },
      { role: "zoomin" },
      { role: 'zoomout' },
      {
        role: "togglefullscreen",
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
        label: "Copy page URL",
        accelerator: "CommandOrControl+Alt+S",
        click() {
          const url = global.mainWindow.webContents.getURL();
          clipboard.writeText(url);
        },
      },
      {
        label: "Copy playing track URL",
        accelerator: "CommandOrControl+Shift+S",
        click() {
          const { url } = getTrackMetaData();
          clipboard.writeText(url);
        },
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
    submenu: createSettings(false),
  },
  {
    role: "windowMenu",
  },
]);
Menu.setApplicationMenu(menu);


function createSettings(isMenuBar) {
  const showMenuBarIconOption = {
    label: "Show Menu Bar Icon",
    type: "checkbox",
    checked: global.store.get("tray"),
    click(menuItem) {
      global.store.set("tray", menuItem.checked);
    },
  };

  return [
    {
      label: "Enable notifications",
      type: "checkbox",
      checked: global.store.get("notifications", true),
      click(menuItem) {
        global.store.set("notifications", menuItem.checked);
      },
    },
    {
      label: "Sync with OS theme",
      type: "checkbox",
      checked: global.store.get("sync-theme", true),
      click(menuItem) {
        global.store.set("sync-theme", menuItem.checked);
      },
    },
    (isMenuBar) ? undefined : showMenuBarIconOption,
    {
      label: "Enable Discord rich presence",
      type: "checkbox",
      checked: global.store.get("discord"),
      click(menuItem) {
        global.store.set("discord", menuItem.checked);
      },
    },
    {
      label: "Global Hotkeys",
      click: showHotkeysDialog,
    },
  ].filter((item) => item !== undefined);
}

exports.createSettingsTemplate = createSettings;