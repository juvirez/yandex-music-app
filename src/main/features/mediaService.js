const { ipcMain } = require("electron");
const { debounce } = require("../utils");
const settings = require("electron-settings");
const MediaService = require("electron-media-service");
const { showTrackNotification } = require("./notifications");
const { trackToMetaData, assignMetadata, getTrackMetaData } = require("./playerMetaData");

const mediaService = new MediaService();
mediaService.startService();

ipcMain.on("changeTrack", (_event, track) => {
  trackToMetaData(track, (metaData) => {
    updateMetadata(metaData);
    if (isNotificationsEnabled() && metaData.state == MediaService.STATES.PLAYING) {
      showTrackNotification();
    }
  });
});

ipcMain.on("changeProgress", (_event, progress) => {
  if (typeof progress.position != "number" || typeof progress.duration != "number") return;

  const mediaServiceProgress = {
    currentTime: progress.position * 1000,
    duration: progress.duration * 1000,
  };
  updateMetadata(mediaServiceProgress);
});

let debounceTimeout;
ipcMain.on("changeState", (_event, state) => {
  if (!state.currentTrack) return;
  if (!MediaService.STATES) return; // for macos < 10.13

  const oldState = getTrackMetaData().state;
  const newState = state.isPlaying ? MediaService.STATES.PLAYING : MediaService.STATES.PAUSED;
  const mediaServiceState = {
    state: newState,
  };
  debounceTimeout = debounce(() => {
    updateMetadata(mediaServiceState);
    if (newState === MediaService.STATES.PLAYING && oldState !== newState && isNotificationsEnabled()) {
      showTrackNotification();
    }
  }, 200, debounceTimeout);
});

ipcMain.on("changeControls", (_event, controls) => {
  if (!controls.currentTrack) return;
  let mediaServiceLiked = {
    liked: controls.currentTrack.liked,
  };
  updateMetadata(mediaServiceLiked);
});

mediaService.on("play", () => {
  playerCmd("play");
});

mediaService.on("pause", () => {
  playerCmd("pause");
});

mediaService.on("playPause", () => {
  playerCmd("togglePause");
});

mediaService.on("next", () => {
  playerCmd("next");
});

mediaService.on("previous", () => {
  playerCmd("prev");
});

mediaService.on("seek", (to) => {
  global.mainWindow.webContents.send("playerSeek", to / 1000);
});

function playerCmd(cmd) {
  global.mainWindow.webContents.send("playerCmd", cmd);
}

function updateMetadata(newMetadata) {
  assignMetadata(newMetadata) && mediaService.setMetaData(getTrackMetaData());
}

function isNotificationsEnabled() {
  return settings.get("notifications", true);
}