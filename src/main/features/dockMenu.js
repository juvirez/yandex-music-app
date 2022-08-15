const { app, Menu, Tray, MenuItem, ipcMain } = require("electron");
const { getLabelForTrack } = require("../utils");

let tray = null;
const trackInfo = new MenuItem({ label: "  –", enabled: false });
const like = new MenuItem({
  label: "Love",
  type: "checkbox",
  enabled: false,
  click: () => playerCmd("toggleLike"),
});
const dislike = new MenuItem({
  label: "Dislike",
  type: "checkbox",
  enabled: false,
  click: () => playerCmd("toggleDislike"),
});
const play = new MenuItem({
  label: "Play",
  enabled: false,
  click: () => playerCmd("togglePause"),
});
const next = new MenuItem({
  label: "Next",
  enabled: false,
  click: () => playerCmd("next"),
});
const previous = new MenuItem({
  label: "Previous",
  enabled: false,
  click: () => playerCmd("prev"),
});
let playlistMenu = createPlayListMenuItem([]);

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
  menu.append(new MenuItem({ type: "separator" }));
  menu.append(playlistMenu);

  // Update Dock
  app.dock.setMenu(menu);

  // Update Tray
  if (tray) {
    menu.append(new MenuItem({ type: "separator" }));
    menu.append(new MenuItem({
      label: "Show App",
      click() {
        global.mainWindow.show();
      },
    }));
    const settings = new MenuItem({
      label: "Menu Bar Settings",
      type: "submenu",
      submenu: [
        new MenuItem({
          type: "checkbox",
          label: "Show song in Menu Bar",
          checked: global.store.get("tray-song", false),
          click(menuItem) {
            tray.showTitle = menuItem.checked;
            global.store.set("tray-song", tray.showTitle);
            refreshMenu();
          },
        }),
        new MenuItem({
          type: "checkbox",
          label: "Hide dock icon",
          checked: global.store.get("hide-dock-icon", false),
          click(menuItem) {            
            global.store.set("hide-dock-icon", menuItem.checked);
          },
        }),
      ],
    });
    menu.append(settings);
    menu.append(new MenuItem({ type: "separator" }));
    menu.append(new MenuItem({ role: "quit", label: "Quit" }));
    tray.setContextMenu(menu);

    tray.setTitle((tray.showTitle && play.playing && trackInfo.label) || "");
  }
}

ipcMain.on("initControls", (_event, { currentTrack, controls }) => {
  handleControlsChange(controls);
  handleTrackChange(currentTrack);

  global.store.onDidChange("tray", initTray);
  initTray(global.store.get("tray"), true);

  refreshMenu();
});

ipcMain.on("changeControls", (_event, { currentTrack, controls }) => {
  handleControlsChange(controls);
  handleTrackChange(currentTrack);

  refreshMenu();
});

ipcMain.on("changeState", (_event, { isPlaying, currentTrack }) => {
  play.label = isPlaying ? "Pause" : "Play";
  play.playing = isPlaying;
  handleTrackChange(currentTrack);

  refreshMenu();
});

ipcMain.on("changePlaylist", (_event, { currentTrack, playlist }) => {
  handleTrackChange(currentTrack);

  if (currentTrack && playlist.length > 0) {
    playlist.forEach((track, index) => {
      track.index = index;
    });
    const currentTrackIndex = playlist.findIndex((track) => {
      return track.link === currentTrack.link;
    });

    if (currentTrackIndex < 0) {
      playlist = playlist.slice(0, 10);
    } else {
      const startIndex = Math.max(currentTrackIndex - 1, 0);
      const endIndex = currentTrackIndex + 10;
      playlist = playlist.slice(startIndex, currentTrackIndex).concat(playlist.slice(currentTrackIndex, endIndex));
    }
  } else {
    playlist = [];
  }
  playlistMenu = createPlayListMenuItem(playlist, currentTrack);
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
    trackInfo.label = "  " + getLabelForTrack(currentTrack);
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

function createPlayListMenuItem(tracks, currentTrack) {
  const menu = new Menu();
  tracks.forEach((track) => {
    menu.append(
      new MenuItem({
        label: getLabelForTrack(track),
        enabled: track.link !== currentTrack.link,
        click: () => {
          global.mainWindow.webContents.send("playTrack", track.index);
        },
      })
    );
  });
  return new MenuItem({
    label: "Playlist",
    type: "submenu",
    enabled: tracks.length > 0,
    submenu: menu,
  });
}

function initTray(trayEnabled, skipRefresh) {
  if (trayEnabled) {
    if (!tray) {
      let logo = "static/trayTemplate.png";
      if (app.isPackaged) logo = `${process.resourcesPath}/${logo}`;
      tray = new Tray(logo);
    }

    tray.showTitle = global.store.get("tray-song", false);

    if (!skipRefresh) refreshMenu();
  } else if (tray) {
    tray.destroy();
    tray = null;
  }
}