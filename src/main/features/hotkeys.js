const { app, globalShortcut, systemPreferences, Notification } = require("electron");
const settings = require("electron-settings");
const { getTrackMetaData } = require("./mediaService");

if (systemPreferences.isTrustedAccessibilityClient(false)) {
  app.on("will-quit", () => {
    globalShortcut.unregisterAll();
  });
  registerCustomShortcuts();
}

exports.reloadShortcuts = () => {
  globalShortcut.unregisterAll();
  registerCustomShortcuts();
};

function registerMediaShortcuts() {
  for (const shortcut of ["MediaNextTrack", "MediaPreviousTrack", "MediaStop", "MediaPlayPause"]) {
    registerShortcut(shortcut, mediaShortcutToCommand(shortcut));
  }
}

function mediaShortcutToCommand(shortcut) {
  switch (shortcut) {
    case "MediaNextTrack":
      return "next";
    case "MediaPreviousTrack":
      return "prev";
    case "MediaStop":
      return "stop";
    case "MediaPlayPause":
      return "togglePause";
  }
}

function registerCustomShortcuts() {
  const hotkeys = settings.get("hotkeys", {});

  registerGlobalHotkeys(hotkeys["play"], "play");
  registerGlobalHotkeys(hotkeys["pause"], "pause");
  registerGlobalHotkeys(hotkeys["play_pause"], "togglePause");

  registerGlobalHotkeys(hotkeys["next_track"], "next");
  registerGlobalHotkeys(hotkeys["previous_track"], "prev");

  registerGlobalHotkeys(hotkeys["love"], "love", () => {
    const metaData = getTrackMetaData();
    if (!metaData.title) return;

    new Notification({
      title: "❤️ " + metaData.title,
      subtitle: metaData.artist,
      silent: true,
    }).show();
  });
  registerGlobalHotkeys(hotkeys["dislike"], "dislike");

  registerGlobalHotkeys(hotkeys["mute_unmute"], "toggleMute");
}

function registerGlobalHotkeys(acceleratorArray, playerCmd, additionalCmd) {
  if (!acceleratorArray) return;
  const accelerator = acceleratorArray.join("+");
  if (!accelerator) return;
  registerShortcut(accelerator, playerCmd, additionalCmd);
}

function registerShortcut(accelerator, playerCmd, additionalCmd) {
  globalShortcut.register(accelerator, () => {
    global.mainWindow && global.mainWindow.webContents.send("playerCmd", playerCmd);
    additionalCmd && additionalCmd();
  });
}
