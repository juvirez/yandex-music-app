const ipc = require("electron").ipcRenderer;

document.addEventListener("DOMContentLoaded", () => {
  let bodyAttributesObserver = new MutationObserver((mutationsList) => {
    for (var mutation of mutationsList) {
      let bodyClasses = document.body.classList;
      if (mutation.attributeName == "class" && bodyClasses.contains("body_bar-tall")) {
        bodyClasses.remove("body_bar-tall");
      }
    }
  });
  bodyAttributesObserver.observe(document.body, { attributes: true });

  initBackNavigationButton();

  externalAPI.on(externalAPI.EVENT_TRACK, () => {
    const track = externalAPI.getCurrentTrack();
    ipc.send("changeTrack", track);
    ipc.send("changePlaylist", {
      currentTrack: track,
      playlist: externalAPI.getTracksList().filter((t) => !!t),
    });
  });

  externalAPI.on(externalAPI.EVENT_PROGRESS, () => {
    ipc.send("changeProgress", externalAPI.getProgress());
  });

  externalAPI.on(externalAPI.EVENT_STATE, () => {
    const track = externalAPI.getCurrentTrack();
    ipc.send("changeState", {
      isPlaying: externalAPI.isPlaying(),
      currentTrack: track,
    });
  });

  externalAPI.on(externalAPI.EVENT_CONTROLS, () => {
    ipc.send("changeControls", {
      currentTrack: externalAPI.getCurrentTrack(),
      controls: externalAPI.getControls(),
    });
  });

  ipc.send("initControls", {
    currentTrack: externalAPI.getCurrentTrack(),
    controls: externalAPI.getControls(),
  });
});

ipc.on("playerCmd", (_event, cmd) => {
  let currentTrack;
  switch (cmd) {
    case "play":
      externalAPI.togglePause(false);
      break;
    case "pause":
      externalAPI.togglePause(true);
      break;
    case "love":
      currentTrack = externalAPI.getCurrentTrack();
      currentTrack && !currentTrack.liked && externalAPI.toggleLike();
      break;
    case "dislike":
      currentTrack = externalAPI.getCurrentTrack();
      currentTrack && !currentTrack.disliked && externalAPI.toggleDislike();
      break;
    case "volumeDown":
      externalAPI.setVolume(externalAPI.getVolume() - 0.1);
      break;
    case "volumeUp":
      externalAPI.setVolume(externalAPI.getVolume() + 0.1);
      break;
    default:
      externalAPI[cmd]();
  }
});

ipc.on("playerSeek", (_event, to) => {
  externalAPI.setPosition(to);
});

ipc.on("navigate", (_event, url) => {
  externalAPI.navigate(url);
});

ipc.on("playTrack", (_event, index) => {
  externalAPI.play(index);
});

function initBackNavigationButton() {
  let headSearch = document.querySelector(".head-kids__controlls");
  if (headSearch) {
    let template = document.createElement("template");
    template.innerHTML = `<div class="head-kids__search"><div class="d-search"><button
      class="d-button deco-button deco-button-flat d-button_type_flat d-button_w-icon d-button_w-icon-centered"
      style="margin-left: 22px; margin-right: -22px;" disabled>
      <span class="d-button-inner deco-button-stylable">
      <span class="d-button__inner"><span class="d-icon deco-icon d-icon_arrow-left"></span></span>
      </span></button></div></div>`;
    let nodeElement = template.content.firstElementChild;
    nodeElement.onclick = () => window.history.back();
    headSearch.insertBefore(nodeElement, headSearch.firstChild);

    ipc.on("navigated", (_event, { canGoBack }) => {
      nodeElement.querySelector('button').disabled = !canGoBack;
    });
  }
}

window.close = undefined;
