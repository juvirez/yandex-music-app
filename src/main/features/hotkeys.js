const { app, globalShortcut, systemPreferences } = require("electron");

if (systemPreferences.isTrustedAccessibilityClient(false)) {
  app.on("will-quit", () => {
    globalShortcut.unregisterAll();
  });
  registerMediaShortcuts();
}

function registerMediaShortcuts() {
  for (const shortcut of ["MediaNextTrack", "MediaPreviousTrack", "MediaStop", "MediaPlayPause"]) {
    globalShortcut.register(shortcut, () => {
      if (global.mainWindow !== null) {
        global.mainWindow.webContents.send("playerCmd", mediaShortcutToCommand(shortcut));
      }
    });
  }
}

function mediaShortcutToCommand(shortcut) {
  switch (shortcut) {
    case "MediaNextTrack":
      return "next";
    case "MediaPreviousTrack":
      return "prev";
    case "MediaStop":
      return "stop";
    case "MediaPlayPause":
      return "togglePause";
  }
}
