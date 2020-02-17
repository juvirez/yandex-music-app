const { session } = require("electron");

// Yandex Metrica uses RTCPeerConnection, which triggered a MacOS warning "accept incoming network connections?"
// Just block it
session.defaultSession.webRequest.onBeforeRequest(
  { urls: ["https://mc.yandex.ru/metrika/watch.js*"] },
  (_details, callback) => {
    callback({ cancel: true });
  }
);
