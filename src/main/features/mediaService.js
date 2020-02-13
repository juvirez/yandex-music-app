const { ipcMain } = require("electron");
const MediaService = require("electron-media-service");

const mediaService = new MediaService();
mediaService.startService();
const metaData = {};

exports.getTrackMetaData = () => {
  return metaData;
};

ipcMain.on("changeTrack", (_event, track) => {
  Object.assign(metaData, trackToMetaData(track));
  mediaService.setMetaData(metaData);
});

ipcMain.on("changeProgress", (_event, progress) => {
  const mediaServiceProgress = {
    currentTime: progress.position * 1000,
    duration: progress.duration * 1000
  };
  Object.assign(metaData, mediaServiceProgress);
  mediaService.setMetaData(metaData);
});

ipcMain.on("changeState", (_event, state) => {
  if (!state.currentTrack) return;
  const mediaServiceState = {
    state: state.isPlaying ? MediaService.STATES.PLAYING : MediaService.STATES.PAUSED
  };
  Object.assign(metaData, mediaServiceState);
  mediaService.setMetaData(metaData);
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

mediaService.on("seek", to => {
  global.mainWindow.webContents.send("playerSeek", to / 1000);
});

function playerCmd(cmd) {
  global.mainWindow.webContents.send("playerCmd", cmd);
}

function trackToMetaData(track) {
  return {
    title: track.title,
    artist: track.artists.map(a => a.title).join(", "),
    album: track.album.title,
    albumArt: "https://" + track.album.cover.replace("%%", "200x200"),
    state: "playing",
    id: hashCode(track.link),
    currentTime: 0,
    duration: track.duration
  };
}

function hashCode(s) {
  for (var i = 0, h = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}
