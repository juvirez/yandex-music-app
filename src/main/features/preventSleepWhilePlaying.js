const { ipcMain, powerSaveBlocker } = require("electron");

let powerSaveBlockerId = null

ipcMain.on("changeState", (_event, state) => {
  if (state.isPlaying) {
    if (!powerSaveBlockerId) {
      powerSaveBlockerId = powerSaveBlocker.start('prevent-app-suspension')
    }
  } else if (powerSaveBlockerId) {
    powerSaveBlocker.stop(powerSaveBlockerId)
  }
});
