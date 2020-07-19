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

function registerCustomShortcuts() {
  const hotkeys = settings.get("hotkeys", {});

  registerGlobalHotkeys(hotkeys["play"], "play");
  registerGlobalHotkeys(hotkeys["pause"], "pause");
  registerGlobalHotkeys(hotkeys["play_pause"], "togglePause");

  registerGlobalHotkeys(hotkeys["next_track"], "next");
  registerGlobalHotkeys(hotkeys["previous_track"], "prev");

  registerGlobalHotkeys(hotkeys["love"], "love", createLoveNotification);
  registerGlobalHotkeys(hotkeys["dislike"], "dislike");
  registerGlobalHotkeys(hotkeys["like_unlike"], "toggleLike", createLoveNotification);

  registerGlobalHotkeys(hotkeys["mute_unmute"], "toggleMute");

  registerGlobalHotkeys(hotkeys["track_info"], undefined, createTrackNotification);

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

function createLoveNotification() {
  const metaData = getTrackMetaData();
  let emoji;
  if (metaData.liked) {
    emoji = "♡";
  } else {
    emoji = "❤️";
  }

  createTrackNotification(emoji + " ");
}

let lastNotification;

function createTrackNotification(titlePrefix) {
  const metaData = getTrackMetaData();
  if (!metaData.title) return;

  let title = metaData.title;
  if (titlePrefix) {
    title = titlePrefix + title;
  }

  lastNotification && lastNotification.close();

  lastNotification = new Notification({
    title: title,
    subtitle: metaData.artist,
    silent: true,
  });
  lastNotification.show();
}
