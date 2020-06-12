const { ipcMain } = require("electron");
const MediaService = require("electron-media-service");

const mediaService = new MediaService();
mediaService.startService();
const metaData = {};

exports.getTrackMetaData = () => {
  return metaData;
};

ipcMain.on("changeTrack", (_event, track) => {
  let metaData = trackToMetaData(track);
  updateMetadata(metaData);
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

  const mediaServiceState = {
    state: state.isPlaying ? MediaService.STATES.PLAYING : MediaService.STATES.PAUSED,
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

function trackToMetaData(track) {
  let coverUrl = undefined;
  if (track.album.cover) {
    coverUrl = "https://" + track.album.cover.replace("%%", "200x200");
  }

  return {
    title: track.title,
    artist: track.artists.map((a) => a.title).join(", "),
    album: track.album.title,
    albumArt: coverUrl,
    state: "playing",
    id: hashCode(track.link),
    currentTime: 0,
    duration: track.duration,
    liked: track.liked,
  };
}

function hashCode(s) {
  for (var i = 0, h = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

function updateMetadata(newMetadata) {
  Object.assign(metaData, newMetadata);
  if (typeof metaData.id != "number") return;

  mediaService.setMetaData(metaData);
}
