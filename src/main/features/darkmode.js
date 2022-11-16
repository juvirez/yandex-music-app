global.store.onDidChange("sync-theme", (newValue) => {
  global.mainWindow.webContents.send("sync-theme-changed", newValue);
});