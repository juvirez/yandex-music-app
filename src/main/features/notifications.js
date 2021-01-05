const { Notification } = require("electron");
const { getTrackMetaData, getCoverFilePath } = require("./playerMetaData");

let lastNotification;

exports.showTrackNotification = showTrackNotification;
exports.showLoveNotification = showLoveNotification;

function showTrackNotification() {
  const metaData = getTrackMetaData();
  let emoji;
  if (metaData.liked) {
    emoji = "❤️ ";
  }

  createTrackNotification(emoji).show();
}

function showLoveNotification(loved) {
  let emoji;
  if (loved) {
    emoji = "❤️";
  } else {
    emoji = "♡";
  }

  createTrackNotification(emoji + " ").show();
}

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
    icon: getCoverFilePath(),
    silent: true,
  });
  return lastNotification;
}
