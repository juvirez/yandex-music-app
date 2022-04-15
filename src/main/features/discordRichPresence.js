const { ipcMain } = require("electron");
const DiscordRPC = require("discord-rpc");

const clientId = '964280130639921202';
let client = null;

if (isDiscordEnabled()) ensureLogged();

ipcMain.on("changeState", (_event, state) => {
  handleTrackChange(state);
});

ipcMain.on("changeTrack", (_event, state) => {
  handleTrackChange(state);
});

function handleTrackChange(state) {
  if (!isDiscordEnabled()) return;

  ensureLogged().then(isLogged => {
    if (isLogged) setActivity(state);
  });
}

function isDiscordEnabled() {
  return global.store.get("discord", false);
}

async function ensureLogged() {
  if (!!client && !!client.user) return true;

  return newLogin();
}

function newLogin() {
  return new Promise(resolve => {
    client = new DiscordRPC.Client({ transport: 'ipc' });
    client.on('disconnected', () => client = null);

    client.login({ clientId }).catch((_err) => resolve(false));
    client.on('ready', () => {
      resolve(true);
    });
  })
}

function setActivity({ isPlaying, currentTrack }) {
  if (!!currentTrack && isPlaying) {
    client.setActivity({
      details: currentTrack.title,
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
