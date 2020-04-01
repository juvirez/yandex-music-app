const { shell } = require("electron");

const webContents = global.mainWindow.webContents;

exports.goBack = () => {
  webContents.goBack();
};

exports.goForward = () => {
  webContents.goForward();
};

exports.navigate = url => {
  webContents.send("navigate", url);
};

webContents.on("did-navigate-in-page", () => {
  let canGoBack = webContents.canGoBack();
  webContents.send("navigated", { canGoBack });
});

webContents.on("new-window", (event, url) => {
  event.preventDefault();

  if (url.includes("passport.yandex.ru/auth?")) {
    global.mainWindow.loadURL(url);
    return;
  }

  const parsedUrl = require("url").parse(url);
  if (parsedUrl.hostname === "music.yandex.ru") {
    global.mainWindow.loadURL(url);
    return;
  }

  if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
    shell.openExternal(url);
  }
});
