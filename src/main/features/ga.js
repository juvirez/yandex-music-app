const { app } = require("electron");
const Analytics = require("electron-google-analytics");
const analytics = new Analytics.default("UA-127383106-1");

let clientId = global.store.get("gaClientId");

global.mainWindow.on("focus", () => {
  analytics
    .screen(
      app.name,
      app.getVersion(),
      "com.github.juvirez.yandexmusicapp",
      "com.github.juvirez.yandexmusicinstaller",
      "main",
      clientId
    )
    .then(response => {
      if (!clientId) {
        clientId = response.clientID;
        global.store.set("gaClientId", clientId);
      }
    });
});
