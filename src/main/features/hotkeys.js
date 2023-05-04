const { app, globalShortcut, systemPreferences } = require("electron");
const { getTrackMetaData } = require("./playerMetaData");
const { showLoveNotification, showTrackNotification } = require("./notifications");

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

function registerCustomShortcuts() {
  const hotkeys = global.store.get("hotkeys", {});

  registerGlobalHotkeys(hotkeys["play"], "play");
  registerGlobalHotkeys(hotkeys["pause"], "pause");
  registerGlobalHotkeys(hotkeys["play_pause"], "togglePause");

  registerGlobalHotkeys(hotkeys["previous_track"], "prev");
  registerGlobalHotkeys(hotkeys["next_track"], "next");
  
  registerGlobalHotkeys(hotkeys["go_backward"], "goBackward");
  registerGlobalHotkeys(hotkeys["go_forward"], "goForward");

  registerGlobalHotkeys(hotkeys["love"], "love", () => {
    showLoveNotification(true);
  });
  registerGlobalHotkeys(hotkeys["dislike"], "dislike");
  registerGlobalHotkeys(hotkeys["like_unlike"], "toggleLike", () => {
    let loved = !getTrackMetaData().liked;
    showLoveNotification(loved);
  });

  registerGlobalHotkeys(hotkeys["mute_unmute"], "toggleMute");

  registerGlobalHotkeys(hotkeys["track_info"], undefined, showTrackNotification);

  registerGlobalHotkeys(hotkeys["volume_down"], "volumeDown");
  registerGlobalHotkeys(hotkeys["volume_up"], "volumeUp");
}

function registerGlobalHotkeys(acceleratorArray, playerCmd, additionalCmd) {
  if (!acceleratorArray) return;
  const accelerator = acceleratorArray.join("+");
  if (!accelerator) return;
  registerShortcut(accelerator, playerCmd, additionalCmd);
}

function registerShortcut(accelerator, playerCmd, additionalCmd) {
  globalShortcut.register(accelerator, () => {
    playerCmd && global.mainWindow && global.mainWindow.webContents.send("playerCmd", playerCmd);
    additionalCmd && additionalCmd();
  });
}
