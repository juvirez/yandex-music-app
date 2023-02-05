const { app, ipcMain, TouchBar, nativeImage } = require('electron')
const { getLabelForTrack } = require("../utils");
const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar

function getIcon(sfSymbolName) {
  let iconPath = `static/touchbar/${sfSymbolName}@2x.png`;
  if (app.isPackaged) {
    iconPath = process.resourcesPath + '/' + iconPath;
  }
  return nativeImage.createFromPath(iconPath);
}

const titleLabel = new TouchBarLabel({});
const likeButton = new TouchBarButton({
  icon: getIcon('heart'),
  enabled: false,
  click: () => playerCmd("toggleLike"),
});
const playButton = new TouchBarButton({
  icon: getIcon('playpause.fill'),
  enabled: false,
  click: () => playerCmd("togglePause"),
});
const nextButton = new TouchBarButton({
  icon: getIcon('forward.fill'),
  enabled: false,
  click: () => playerCmd("next"),
});
const prevButton = new TouchBarButton({
  icon: getIcon('backward.fill'),
  enabled: false,
  click: () => playerCmd("prev"),
});

function playerCmd(cmd) {
  global.mainWindow.webContents.send("playerCmd", cmd);
}

function handleControlsChange(controls) {
  nextButton.enabled = controls.next;
  prevButton.enabled = controls.prev;
}

function handleTrackChange(currentTrack) {
  const hasCurrentTrack = !!currentTrack;
  playButton.enabled = hasCurrentTrack;
  likeButton.enabled = hasCurrentTrack;
  if (hasCurrentTrack) {
    titleLabel.label = getLabelForTrack(currentTrack);
    likeButton.icon = (currentTrack.liked) ? getIcon('heart.fill') : getIcon('heart');
  } else {
    titleLabel.label = '';
  }
}

ipcMain.on('initControls', (_event, { controls, currentTrack }) => {
  handleControlsChange(controls);
  handleTrackChange(currentTrack);
});

ipcMain.on("changeControls", (_event, { controls, currentTrack }) => {
  handleControlsChange(controls);
  handleTrackChange(currentTrack);
});

ipcMain.on("changeState", (_event, { isPlaying, currentTrack }) => {
  playButton.icon = isPlaying ? getIcon('pause.fill') : getIcon('play.fill');
  handleTrackChange(currentTrack);
});

ipcMain.on("changeTrack", (_event, { currentTrack }) => {
  handleTrackChange(currentTrack);
});

global.mainWindow.setTouchBar(new TouchBar({
  items: [
    likeButton,
    titleLabel,
    new TouchBarSpacer({ size: 'flexible' }),
    prevButton,
    playButton,
    nextButton,
  ]
}));  
