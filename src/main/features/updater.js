const { autoUpdater } = require("electron-updater");

autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  console.log('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  console.log('Update not available.');
})
autoUpdater.on('error', (err) => {
  console.log('Error in auto-updater. ' + err);
})

autoUpdater.checkForUpdatesAndNotify();