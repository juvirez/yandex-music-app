const { ipcMain, Notification } = require("electron");
const { getTrackMetaData } = require("./mediaService");

let lastNotification;

exports.showTrackNotification = createTrackNotification;
exports.showLoveNotification = createLoveNotification;

function createTrackNotification(titlePrefix) {
  const metaData = getTrackMetaData();
  if (!metaData.title) return;

  let title = metaData.title;
  if (titlePrefix) {
    title = titlePrefix + title;
  }

  lastNotification && lastNotification.close();

  lastNotification = new Notification({
    title: title,
    subtitle: metaData.artist,
    silent: true,
  });
  lastNotification.show();
}

function createLoveNotification(loved) {
  let emoji;
  if (loved) {
    emoji = "❤️";
  } else {
    emoji = "♡";
  }

  createTrackNotification(emoji + " ");
}
