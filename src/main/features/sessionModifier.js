const { session } = require("electron");

// // Yandex Metrica uses RTCPeerConnection, which triggered a MacOS warning "accept incoming network connections?"
// // Just block it + block ads
session.defaultSession.webRequest.onBeforeRequest({ urls: ['*://*/*'] }, (details, callback) => {
    if (details.url.includes("awaps.yandex.net") ||
      details.url.includes("vh-bsvideo-converted") ||
      details.url.includes("get-video-an") ||       
      details.url.includes("metrika/") ||       
      details.url.includes("an.yandex.ru/vmap/")) {
      callback({ cancel: true });
    }
    else {
      callback({});
    }
  })
