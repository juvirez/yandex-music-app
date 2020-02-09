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

webContents.on("new-window", e => {
  const protocol = require("url").parse(e.url).protocol;
  if (protocol === "http:" || protocol === "https:") {
    shell.openExternal(e.url);
  }
});
