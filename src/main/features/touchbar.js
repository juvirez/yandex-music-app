const { ipcMain, TouchBar, nativeImage } = require('electron')
const { getLabelForTrack } = require("../utils");
const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar

const titleLabel = new TouchBarLabel({});
const likeButton = new TouchBarButton({
  label: '️􀊴',
  enabled: false,
  click: () => playerCmd("toggleLike"),
});
const playButton = new TouchBarButton({
  label: '􀊈',
  enabled: false,
  click: () => playerCmd("togglePause"),
});
const nextButton = new TouchBarButton({
  label: '􀊌',
  enabled: false,
  click: () => playerCmd("next"),
});
const prevButton = new TouchBarButton({
  label: '􀊊',
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
    likeButton.label = (currentTrack.liked) ? '􀊵' : '􀊴';
  } else {
    titleLabel.label = '';
  }
}

ipcMain.on('initControls', (_event, { currentTrack, controls }) => {
  handleControlsChange(controls);
  handleTrackChange(currentTrack);
});

ipcMain.on("changeControls", (_event, { currentTrack, controls }) => {
  handleControlsChange(controls);
  handleTrackChange(currentTrack);
});

ipcMain.on("changeState", (_event, { isPlaying, currentTrack }) => {
  playButton.label = isPlaying ? '􀊆' : '􀊄';
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
