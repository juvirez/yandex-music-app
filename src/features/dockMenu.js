const { app, Menu, MenuItem, ipcMain } = require("electron");

const trackInfo = new MenuItem({ label: "  –", enabled: false });
const like = new MenuItem({
  label: "Love",
  type: "checkbox",
  enabled: false,
  click: () => playerCmd("toggleLike")
});
const dislike = new MenuItem({
  label: "Dislike",
  type: "checkbox",
  enabled: false,
  click: () => playerCmd("toggleDislike")
});
const play = new MenuItem({
  label: "Play",
  enabled: false,
  click: () => playerCmd("togglePause")
});
const next = new MenuItem({
  label: "Next",
  enabled: false,
  click: () => playerCmd("next")
});
const previous = new MenuItem({
  label: "Previous",
  enabled: false,
  click: () => playerCmd("prev")
});

refreshMenu();

function refreshMenu() {
  const menu = new Menu();
  menu.append(new MenuItem({ label: "Now Playing", enabled: false }));
  menu.append(trackInfo);
  menu.append(like);
  menu.append(dislike);
  menu.append(new MenuItem({ type: "separator" }));
  menu.append(play);
  menu.append(next);
  menu.append(previous);
  app.dock.setMenu(menu);
}

ipcMain.on("initControls", (_event, { currentTrack, controls }) => {
  handleControlsChange(controls);
  handleTrackChange(currentTrack);

  refreshMenu();
});

ipcMain.on("changeControls", (_event, { currentTrack, controls }) => {
  handleControlsChange(controls);
  handleTrackChange(currentTrack);

  refreshMenu();
});

ipcMain.on("changeState", (_event, { isPlaying, currentTrack }) => {
  play.label = isPlaying ? "Pause" : "Play";
  handleTrackChange(currentTrack);

  refreshMenu();
});

function playerCmd(cmd) {
  global.mainWindow.webContents.send("playerCmd", cmd);
}

function handleControlsChange(controls) {
  next.enabled = controls.next;
  previous.enabled = controls.prev;
}

function handleTrackChange(currentTrack) {
  const hasCurrentTrack = !!currentTrack;
  if (hasCurrentTrack) {
    trackInfo.label = "  " + currentTrack.title + " – " + currentTrack.artists.map(a => a.title).join(", ");
    like.checked = currentTrack.liked;
    like.label = currentTrack.liked ? "Loved" : "Love";
    dislike.checked = currentTrack.disliked;
    dislike.label = currentTrack.disliked ? "Disliked" : "Dislike";
  }

  like.enabled = hasCurrentTrack;
  dislike.enabled = hasCurrentTrack;
  play.enabled = hasCurrentTrack;
  next.enabled = hasCurrentTrack;
  previous.enabled = hasCurrentTrack;
  if (!hasCurrentTrack) {
    trackInfo.label = "  –";
  }
}
