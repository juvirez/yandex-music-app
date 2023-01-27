const { app, Menu, Tray, MenuItem, ipcMain } = require("electron");
const { getLabelForTrack } = require("../utils");
const { isDockIconVisible, setDockIconVisible } = require("./dockIcon");
const { createSettingsTemplate } = require("./menu");

let i18n = new (require("../locales/i18n"))();

let tray = null;
const trackInfo = new MenuItem({ label: "  –", enabled: false });
const like = new MenuItem({
  label: i18n.__("Love"),
  type: "checkbox",
  enabled: false,
  click: () => playerCmd("toggleLike"),
});
const dislike = new MenuItem({
  label: i18n.__("Dislike"),
  type: "checkbox",
  enabled: false,
  click: () => playerCmd("toggleDislike"),
});
const play = new MenuItem({
  label: i18n.__("Play"),
  enabled: false,
  click: () => playerCmd("togglePause"),
});
const next = new MenuItem({
  label: i18n.__("Next"),
  enabled: false,
  click: () => playerCmd("next"),
});
const previous = new MenuItem({
  label: i18n.__("Previous"),
  enabled: false,
  click: () => playerCmd("prev"),
});
let playlistMenu = createPlayListMenuItem([]);

refreshMenu();

function refreshMenu() {
  const menu = new Menu();
  menu.append(new MenuItem({ label: i18n.__("Now Playing"), enabled: false }));
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
    menu.append(
      new MenuItem({
        label: i18n.__("Show App"),
        click() {
          global.mainWindow.show();
        },
      })
    );
    menu.append(
      new MenuItem({
        type: "checkbox",
        label: i18n.__("Hide dock icon"),
        checked: !isDockIconVisible(),
        click(menuItem) {
          setDockIconVisible(!menuItem.checked);
          refreshMenu();
        },
      })
    );
    if (!isDockIconVisible()) {
      menu.append(createMainSettings());
    }
    menu.append(createMenuBarSettings());
    menu.append(new MenuItem({ type: "separator" }));
    menu.append(new MenuItem({ role: "quit", label: i18n.__("Quit") }));
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
  play.label = isPlaying ? i18n.__("Pause") : i18n.__("Play");
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
    like.label = currentTrack.liked ? i18n.__("Loved") : i18n.__("Love");
    dislike.checked = currentTrack.disliked;
    dislike.label = currentTrack.disliked ? i18n.__("Disliked") : i18n.__("Dislike");
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
    label: i18n.__("Playlist"),
    type: "submenu",
    enabled: tracks.length > 0,
    submenu: menu,
  });
}

function createMenuBarSettings() {
  return new MenuItem({
    label: i18n.__("Menu Bar Settings"),
    type: "submenu",
    submenu: [
      new MenuItem({
        type: "checkbox",
        label: i18n.__("Show song in Menu Bar"),
        checked: global.store.get("tray-song", false),
        click(menuItem) {
          tray.showTitle = menuItem.checked;
          global.store.set("tray-song", tray.showTitle);
          refreshMenu();
        },
      }),
    ],
  });
}

function createMainSettings() {
  const settingsTemplate = createSettingsTemplate(true);
  return new MenuItem({
    label: i18n.__("Settings"),
    type: "submenu",
    submenu: Menu.buildFromTemplate(settingsTemplate),
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
