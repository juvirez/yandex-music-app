const { session } = require("electron");
const fetch = require('node-fetch');

// Yandex Metrica uses RTCPeerConnection, which triggered a MacOS warning "accept incoming network connections?"
// Just block it
session.defaultSession.webRequest.onBeforeRequest(
  { urls: ["https://mc.yandex.ru/metrika/*"] },
  (_details, callback) => {
    callback({ cancel: true });
  }
);

function getHeaderString(headers) {
  let responseHeader = '';
  headers.forEach((header, key) => {
    responseHeader += key + ':' + header + '\n';
  });
  return responseHeader;
}

async function doHttpRequest(request, success, error) {
  let finalResponse = {};
  let response = await fetch(request.url, {
    method: request.method,
    mode: 'cors',
    headers: request.headers,
    redirect: 'follow',
    body: request.postData,
  });
  finalResponse.response = await response.text();
  finalResponse.headers = getHeaderString(response.headers);
  if (response.ok) {
    success(finalResponse);
  } else {
    error(finalResponse);
  }
}

function prepareDebugFetchParam(param) {
  return btoa(unescape(encodeURIComponent(param)));
}

function modifyResponse(response) {
  return response.replace(/sandman:\{[^}]+:([^,}]+),[^}]+:([^}]+)\}/, (match, p1, p2) => {
    return match.replace(p1, "1e100").replace(p2, "1e100");
  });
}

const debugee = global.mainWindow.webContents.debugger;
debugee.attach("1.1");
debugee.sendCommand("Fetch.enable", { patterns: [{ urlPattern: 'https://music.yandex.ru/api/v2.1/index/music.yandex.ru?v=*' }] });
debugee.on("message", (_event, method, params) => {
  const request = params.request;
  let continueParams = {
    requestId: params.requestId,
  };

  if (method === "Fetch.requestPaused") {
    doHttpRequest(request, (data) => {
      continueParams.responseCode = 200;
      continueParams.binaryResponseHeaders = prepareDebugFetchParam(data.headers.replace(/(?:\r\n|\r|\n)/g, '\0'));
      continueParams.body = prepareDebugFetchParam(modifyResponse(data.response));
      debugee.sendCommand('Fetch.fulfillRequest', continueParams);
    }, (_status) => {
      debugee.sendCommand('Fetch.continueRequest', continueParams);
    });
  }
});