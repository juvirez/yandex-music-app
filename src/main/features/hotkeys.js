const { app, globalShortcut, systemPreferences } = require("electron");
const settings = require("electron-settings");

if (systemPreferences.isTrustedAccessibilityClient(false)) {
  app.on("will-quit", () => {
    globalShortcut.unregisterAll();
  });
  registerMediaShortcuts();
  registerCustomShortcuts();
}

exports.reloadShortcuts = () => {
  globalShortcut.unregisterAll();
  registerMediaShortcuts();
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

  registerGlobalHotkeys(hotkeys["love"], "love");
  registerGlobalHotkeys(hotkeys["dislike"], "dislike");

  registerGlobalHotkeys(hotkeys["mute_unmute"], "toggleMute");
}

function registerGlobalHotkeys(acceleratorArray, playerCmd) {
  if (!acceleratorArray) return;
  const accelerator = acceleratorArray.join("+");
  if (!accelerator) return;
  registerShortcut(accelerator, playerCmd);
}

function registerShortcut(accelerator, playerCmd) {
  globalShortcut.register(accelerator, () => {
    global.mainWindow && global.mainWindow.webContents.send("playerCmd", playerCmd);
  });
}
