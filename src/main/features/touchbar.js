const { ipcMain, TouchBar } = require('electron')

const { TouchBarLabel, TouchBarButton, TouchBarSpacer, TouchBarSegmentedControl } = TouchBar

const titleLabel = new TouchBarLabel({
  label: '',
  accessibilityLabel: 'Button looking like a label',
  backgroundColor: '#000',
});

let trackLike = false;
let trackDislike = false;

const likeButton = new TouchBarButton({
  label: '️❤️',
  backgroundColor: '#404040',
  click: () => {
    playerCmd("toggleLike");
    trackLike = !trackLike;
    updateLikeButtons();
  },
});
const dislikeButton = new TouchBarButton({
  label: '️🚫',
  backgroundColor: '#404040',
  click: () => {
    playerCmd("toggleDislike");
    trackDislike = !trackDislike;
    updateLikeButtons();
  },
});
const playButton = new TouchBarButton({
  label: '▶️',
  backgroundColor: '#404040',
  click: () => playerCmd("togglePause"),
});
const playerSegment = new TouchBarSegmentedControl({
    segmentStyle: 'automatic',
    mode: 'buttons',
    segments: [
      { label: '⏮️' },
      { label: '⏭' },
    ],
    change: (selectedIndex) => {
      switch(selectedIndex) {
        case 0: playerCmd("prev"); break;
        case 1: playerCmd("next"); break;
      }
    },
  });

const touchBar = new TouchBar({
  items: [
    likeButton,
    dislikeButton,
    titleLabel,
    new TouchBarSpacer({ size: 'flexible' }),
    playButton,
    playerSegment
  ]
})

function playerCmd(cmd) {
  global.mainWindow.webContents.send("playerCmd", cmd);
}

ipcMain.on("changeTrack", (_event, track) => {
  updateTouchBar(track)
});
ipcMain.on("changeState", (_event, state) => {
  if (!state.currentTrack) return;
  playButton.label = state.isPlaying ? '⏸' : '▶️';
  updateTouchBar(state.currentTrack)
})

function updateTouchBar(track){
  track.disliked = track.disliked ?? undefined;
  trackLike = track.liked;
  trackDislike = track.disliked;
  updateLikeButtons();
  titleLabel.label = getLabelForTrack(track);
}
function updateLikeButtons(){
  likeButton.backgroundColor = trackLike ? '#d0d0d0' : '#404040';
  dislikeButton.backgroundColor = trackDislike ? '#d0d0d0' : '#404040';
}

function getLabelForTrack(track) {
  track.artists = track.artists ?? undefined;
  let newTitle = track.title + (track.artists ? " – " + track.artists.map((a) => a.title).join(", ") : '');
  if (newTitle.length > 35) {
    newTitle = newTitle.substring(0, 35) + '…';
  }
  return newTitle;
}
global.mainWindow.setTouchBar(touchBar)
