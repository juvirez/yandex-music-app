const { Notification } = require("electron");
const { debounce } = require("../utils");
const { getTrackMetaData, getCoverFilePath } = require("./playerMetaData");

let lastNotification;

exports.showLoveNotification = showLoveNotification;
exports.showTrackNotification = debounce(() => {
  const metaData = getTrackMetaData();
  let emoji;
  if (metaData.liked) {
    emoji = "❤️ ";
  }
  const notification = createTrackNotification(emoji);
  notification && notification.show();
}, 300);


function showLoveNotification(loved) {
  let emoji;
  if (loved) {
    emoji = "❤️ ";
  } else {
    emoji = "♡ ";
  }

  const notification = createTrackNotification(emoji);
  notification && notification.show();
}

function createTrackNotification(titlePrefix) {
  if (global.mainWindow.isFocused()) return;

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
  lastNotification.on("click", () => {
    global.mainWindow.show();
  });
  return lastNotification;
}
