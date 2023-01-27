const { app, Menu, shell, MenuItem } = require("electron");
const { showOpenURLDialog } = require("../dialogs/openURL");
const { showHotkeysDialog } = require("../dialogs/hotkeys");
const navigation = require("./navigation");
const { showLoader } = require("../index");

let i18n = new (require("../locales/i18n"))();
const isMac = process.platform === "darwin";

const menu = Menu.buildFromTemplate([
  {
    label: app.name,
    //label: i18n.__("App Name"),
    submenu: [
      { role: "about", label: i18n.__("About Yandex Music") },
      {
        label: i18n.__("Website"),
        click() {
          shell.openExternal("https://yandex-music.juvs.dev");
        },
      },
      {
        label: i18n.__("GitHub"),
        click() {
          shell.openExternal("https://github.com/juvirez/yandex-music-app");
        },
      },
      { type: "separator" },
      { role: "services", label: i18n.__("Services"), submenu: [] },
      { type: "separator" },
      { role: "hide", label: i18n.__("Hide Yandex Music") },
      { role: "hideothers", label: i18n.__("Hide Others") },
      { role: "unhide", label: i18n.__("Unhide") },
      { type: "separator" },
      { role: "quit", label: i18n.__("Quit Yandex Music") },
    ],
  },
  {
    //role: "editMenu",
    label: i18n.__("Edit"),
    submenu: [
      { role: "undo", label: i18n.__("Undo") },
      { role: "redo", label: i18n.__("Redo") },
      { type: "separator" },
      { role: "cut", label: i18n.__("Cut") },
      { role: "copy", label: i18n.__("Copy") },
      { role: "paste", label: i18n.__("Paste") },
      ...(isMac
        ? [
            { role: "pasteAndMatchStyle", label: i18n.__("Paste and Match Style") },
            { role: "delete", label: i18n.__("Delete") },
            { role: "selectAll", label: i18n.__("Select All") },
            { type: "separator" },
            {
              label: i18n.__("Speech"),
              submenu: [
                { role: "startSpeaking", label: i18n.__("Start Speaking") },
                { role: "stopSpeaking", label: i18n.__("Stop Speaking") },
              ],
            },
          ]
        : [
            { role: "delete", label: i18n.__("Delete") },
            { type: "separator" },
            { role: "selectAll", label: i18n.__("Select All") },
          ]),
    ],
  },
  {
    label: i18n.__("View"),
    submenu: [
      {
        label: i18n.__("Reload"),
        accelerator: "CommandOrControl+R",
        click() {
          showLoader();
          global.mainWindow.reload();
        },
      },
      { type: "separator" },
      { role: "zoomin", label: i18n.__("Zoom In") },
      { role: "zoomout", label: i18n.__("Zoom Out") },
      { role: "togglefullscreen", label: i18n.__("Toggle Full Screen") },
    ],
  },
  {
    label: i18n.__("Navigate"),
    submenu: [
      {
        label: i18n.__("Back"),
        accelerator: "CommandOrControl+[",
        click: navigation.goBack,
      },
      {
        label: i18n.__("Forward"),
        accelerator: "CommandOrControl+]",
        click: navigation.goForward,
      },
      {
        type: "separator",
      },
      {
        label: i18n.__("Open URL"),
        accelerator: "CommandOrControl+O",
        click: showOpenURLDialog,
      },
    ],
  },
  {
    label: i18n.__("Settings"),
    submenu: createSettings(false),
  },
  {
    //role: "windowMenu",
    label: i18n.__("Window"),
    submenu: [
      { role: "minimize", label: i18n.__("Minimize") },
      { role: "zoom", label: i18n.__("Zoom") },
      ...(isMac
        ? [
            { role: "close", label: i18n.__("Close Window") },
            //{ type: "separator" },
            //{ role: "front", label: i18n.__("Bring All to Front") },
            //{ type: "separator" },
            //{ role: "window" },
          ]
        : [{ role: "close", label: i18n.__("Close") }]),
    ],
  },
]);
Menu.setApplicationMenu(menu);

function createSettings(isMenuBar) {
  const showMenuBarIconOption = {
    label: i18n.__("Show Menu Bar Icon"),
    type: "checkbox",
    checked: global.store.get("tray"),
    click(menuItem) {
      global.store.set("tray", menuItem.checked);
    },
  };

  return [
    {
      label: i18n.__("Enable notifications"),
      type: "checkbox",
      checked: global.store.get("notifications", true),
      click(menuItem) {
        global.store.set("notifications", menuItem.checked);
      },
    },
    {
      label: i18n.__("Enable Discord rich presence"),
      type: "checkbox",
      checked: global.store.get("discord"),
      click(menuItem) {
        global.store.set("discord", menuItem.checked);
      },
    },
    isMenuBar ? undefined : showMenuBarIconOption,
    {
      label: i18n.__("Global Hotkeys"),
      click: showHotkeysDialog,
    },
  ].filter((item) => item !== undefined);
}

exports.createSettingsTemplate = createSettings;
