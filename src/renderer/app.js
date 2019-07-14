const webview = document.querySelector("webview");
const { ipcRenderer, shell } = require("electron");
const Analytics = require("electron-ga");

webview.addEventListener("dom-ready", () => {
  webview.insertCSS(`
        .d-overhead, .ads-block, .ads-block__no-ads, .bar-below, .tableau {
            display: none !important;
        }
        .
    `);
  webview.insertCSS(`
        .passp-social-block {
          display: none !important;
        }
  `);
  document.body.classList.remove("loading");
});

ipcRenderer.on("playerCmd", (_event, playerCmd) => {
  webview.send("playerCmd", playerCmd);
});

ipcRenderer.on("playerSeek", (_event, to) => {
  webview.send("playerSeek", to);
});

ipcRenderer.on("playTrack", (_event, index) => {
  webview.send("playTrack", index);
});

ipcRenderer.on("history", (_event, action) => {
  switch (action) {
    case "back":
      webview.goBack();
      break;
    case "forward":
      webview.goForward();
      break;
  }
});

ipcRenderer.on("navigate", (_event, url) => {
  webview.send("navigate", url);
});

webview.addEventListener("did-navigate-in-page", () => {
  let canGoBack = webview.canGoBack();
  webview.send("navigated", { canGoBack });
});

webview.addEventListener("new-window", e => {
  const protocol = require("url").parse(e.url).protocol;
  if (protocol === "http:" || protocol === "https:") {
    shell.openExternal(e.url);
  }
});

const analytics = new Analytics.default("UA-127383106-1");
ipcRenderer.on("windowFocus", () => {
  analytics.send("screenview", { cd: "main" });
});
