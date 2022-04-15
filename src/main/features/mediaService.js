const { ipcMain } = require("electron");
const MediaService = require("electron-media-service");
const { showTrackNotification } = require("./notifications");
const { trackToMetaData, assignMetadata, getTrackMetaData } = require("./playerMetaData");

const mediaService = new MediaService();
mediaService.startService();

ipcMain.on("changeTrack", (_event, { currentTrack }) => {
  trackToMetaData(currentTrack, (metaData) => {
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

ipcMain.on("changeState", (_event, state) => {
  if (!state.currentTrack) return;
  if (!MediaService.STATES) return; // for macos < 10.13

  const oldState = getTrackMetaData().state;
  const newState = state.isPlaying ? MediaService.STATES.PLAYING : MediaService.STATES.PAUSED;
  const mediaServiceState = {
    state: newState,
  };
  updateMetadata(mediaServiceState);
});

ipcMain.on("changeControls", (_event, controls) => {
  if (!controls.currentTrack) return;
  let mediaServiceLiked = {
    liked: controls.currentTrack.liked,
  };
  updateMetadata(mediaServiceLiked);
});

let pausedDate;

function onPaused() {
  pausedDate = new Date();
}

function onPlayed() {
  if (!pausedDate || !isNotificationsEnabled()) return;
  const now = new Date();
  const seconds = Math.round((now.getTime() - pausedDate.getTime()) / 1000);
  pausedDate = undefined;
  if (seconds > 20) {
    showTrackNotification();
  }
}

mediaService.on("play", () => {
  playerCmd("play");
  onPlayed();
});

mediaService.on("pause", () => {
  playerCmd("pause");
  onPaused();
});

mediaService.on("playPause", () => {
  if (getTrackMetaData().state === MediaService.STATES.PLAYING) {
    playerCmd("pause");
    onPaused();
  } else {
    playerCmd("play");
    onPlayed();
  }
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
  return global.store.get("notifications", true);
}
