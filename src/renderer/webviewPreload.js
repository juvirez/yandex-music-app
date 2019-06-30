const ipc = require("electron").ipcRenderer;
const settings = require("electron-settings");

document.addEventListener("DOMContentLoaded", () => {
  let bodyAttributesObserver = new MutationObserver(mutationsList => {
    for (var mutation of mutationsList) {
      let bodyClasses = document.body.classList;
      if (mutation.attributeName == "class" && bodyClasses.contains("body_bar-tall")) {
        bodyClasses.remove("body_bar-tall");
      }
    }
  });
  bodyAttributesObserver.observe(document.body, { attributes: true });

  let loginButton = document.querySelector(".log-in");
  if (loginButton) {
    loginButton.addEventListener("click", e => {
      window.location = "https://passport.yandex.ru/auth?origin=music&retpath=https%3A%2F%2Fmusic.yandex.ru";
      e.stopPropagation();
    });
  }

  initBackNavigationButton();

  externalAPI.on(externalAPI.EVENT_TRACK, () => {
    const track = externalAPI.getCurrentTrack();
    if (settings.get("notifications", true) && externalAPI.isPlaying()) {
      new Notification(track.title, {
        body: track.artists.map(a => a.title).join(", "),
        icon: "https://" + track.cover.replace("%%", "100x100"),
        silent: true
      });
    }
    ipc.send("changeTrack", track);
  });

  externalAPI.on(externalAPI.EVENT_PROGRESS, () => {
    ipc.send("changeProgress", externalAPI.getProgress());
  });

  externalAPI.on(externalAPI.EVENT_STATE, () => {
    ipc.send("changeState", {
      isPlaying: externalAPI.isPlaying(),
      currentTrack: externalAPI.getCurrentTrack()
    });
  });

  externalAPI.on(externalAPI.EVENT_CONTROLS, () => {
    ipc.send("changeControls", {
      currentTrack: externalAPI.getCurrentTrack(),
      controls: externalAPI.getControls()
    });
  });

  ipc.send("initControls", {
    currentTrack: externalAPI.getCurrentTrack(),
    controls: externalAPI.getControls()
  });
});

ipc.on("playerCmd", (_event, cmd) => {
  if (cmd == "play") {
    externalAPI.togglePause(false);
  } else if (cmd == "pause") {
    externalAPI.togglePause(true);
  } else {
    externalAPI[cmd]();
  }
});

ipc.on("playerSeek", (_event, to) => {
  externalAPI.setPosition(to);
});

ipc.on("navigate", (_event, url) => {
  externalAPI.navigate(url);
});

function initBackNavigationButton() {
  let headSearch = document.querySelector(".head__search");
  if (headSearch) {
    let template = document.createElement("template");
    template.innerHTML = `<button class="d-button deco-button deco-button-flat d-button_type_flat d-button_w-icon d-button_w-icon-centered"
      style="margin-left: 22px; margin-right: -22px;" disabled>
      <span class="d-button-inner deco-button-stylable">
      <span class="d-button__inner"><span class="d-icon deco-icon d-icon_arrow-left"></span></span>
      </span></button>`;
    let nodeElement = template.content.firstElementChild;
    nodeElement.onclick = () => window.history.back();
    headSearch.insertBefore(nodeElement, headSearch.firstChild);

    ipc.on("navigated", (_event, { canGoBack }) => {
      nodeElement.disabled = !canGoBack;
    });
  }
}
