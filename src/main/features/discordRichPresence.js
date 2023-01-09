const { ipcMain } = require("electron");
const DiscordRPC = require("discord-rpc");
const { debounce } = require("../utils");

const clientId = '964280130639921202';
let client = null;
let clientIsReady = false;

global.store.onDidChange("discord", () => {
  if (!isDiscordEnabled()) freeClient();
});

ipcMain.on("changeState", (_event, state) => handleTrackChange(state));

ipcMain.on("changeTrack", (_event, state) => handleTrackChange(state));

const handleTrackChange = debounce((state) => {
  if (!isDiscordEnabled()) return;

  ensureLogged().then(isLogged => {
    if (isLogged) setActivity(state);
  });
}, 1000);

function isDiscordEnabled() {
  return global.store.get("discord", false);
}

async function ensureLogged() {
  if (clientIsReady) return true;

  await freeClient();
  return newLogin();
}

function newLogin() {
  return new Promise(resolve => {
    client = new DiscordRPC.Client({ transport: 'ipc' });
    client.on('disconnected', () => freeClient());

    client
      .login({ clientId })
      .catch((_err) => resolve(false));

    client.on('ready', () => {
      clientIsReady = true;
      return resolve(true);
    });
  });
}

async function freeClient() {
  if (!clientIsReady) return;

  await client.destroy();
  client = null;
  clientIsReady = false;
}

function setActivity({ isPlaying, currentTrack }) {
  if (!!currentTrack && isPlaying) {
    client.setActivity({
      details: currentTrack.title,
      type: ActivityType.Listening
      state: currentTrack.artists.map(a => a.title).join(", "),
      largeImageKey: 'https://' + currentTrack.cover.replace("%%", "200x200"),
      largeImageText: currentTrack.album.title,
      buttons: [
        {
          url: "https://music.yandex.ru" + currentTrack.link,
          label: "Open in Yandex Music"
        }
      ]
    });
  } else {
    client.clearActivity();
  }
}
