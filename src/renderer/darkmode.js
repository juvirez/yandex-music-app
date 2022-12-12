const { ipcRenderer } = require("electron");

let yandexMusicDarkTheme;
const bodyAttributesObserver = new MutationObserver(() => {
  ipcRenderer.invoke('getStoreValue', 'sync-theme', true).then(syncTheme => {
    if (!syncTheme) {
      yandexMusicDarkTheme = isCurrentThemeIsDark();
    }
  });
  refreshTheme();
});

document.addEventListener("DOMContentLoaded", () => {
  yandexMusicDarkTheme = isCurrentThemeIsDark();

  refreshTheme();
  
  bodyAttributesObserver.observe(document.body, { attributes: true });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', refreshTheme);
});

ipcRenderer.on("sync-theme-changed", (_event, syncTheme) => {
  if (syncTheme) {
    refreshTheme();
  } else {
    changeThemeForced(yandexMusicDarkTheme);
  }
  if (isOtherSettingsPage()) {
    manageDarkToggleHandler(syncTheme);
  }
});

ipcRenderer.on("navigated", () => {
  if (isOtherSettingsPage()) {
    ipcRenderer.invoke('getStoreValue', 'sync-theme', true).then(syncTheme => {
      if (syncTheme) {
        manageDarkToggleHandler(syncTheme);
      }
    });
  }
});

function isOtherSettingsPage() {
  return window.location.pathname === '/settings/other';
}

function manageDarkToggleHandler(syncTheme, n = 0) {
  if (n > 5) {
    return;
  }
  setTimeout(() => {
    const toggler = document.querySelector('.page-settings__dark-theme-toggler .deco-toggler');
    if (toggler === null) {
      manageDarkToggleHandler(syncTheme, n + 1);
    } else {
      toggler.classList[(syncTheme) ? 'add' : 'remove']('deco-toggler_disabled');
      toggler.querySelector('.deco-toggler-view').childNodes.forEach((el) => {
        el[(syncTheme) ? 'addEventListener' : 'removeEventListener']('click', darkModeTogglerEventHandler);
      });
    }
  }, n * 200);
}

function darkModeTogglerEventHandler(e) {
  window.alert('The Yandex Music theme is synchronized with the theme of the OS.\nChange it on Settings — Sync with OS theme');
  e.stopPropagation();
}

async function refreshTheme() {
  const syncTheme = await ipcRenderer.invoke('getStoreValue', 'sync-theme', true);
  if (!syncTheme) {
    return;
  }

  const osThemeIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  changeThemeForced(osThemeIsDark);
}

function changeThemeForced(darkTheme) {
  bodyAttributesObserver.disconnect();
  Mu.settings.theme = (darkTheme) ? 'black' : 'white';

  const darkClassNames = ['theme', 'black', 'theme-black', 'icon-theme-black'];
  const lightClassNames = ['theme-white', 'icon-theme-white'];
  const logoDarkClassNames = ['d-logo__white', 'd-logo__white__' + getLogoLang()];

  if (darkTheme) {
    document.body.classList.remove(...lightClassNames);
    document.body.classList.add(...darkClassNames);
    document.querySelector('.d-logo').classList.add(...logoDarkClassNames);
    document.querySelector('.page-root').classList.add('theme');
    document.querySelector('.centerblock-wrapper').classList.add('theme');
    document.querySelector('.centerblock').classList.add('theme');
  } else {
    document.body.classList.remove(...darkClassNames);
    document.body.classList.add(...lightClassNames);
    document.querySelector('.d-logo').classList.remove(...logoDarkClassNames);
    document.querySelector('.page-root').classList.remove('theme');
    document.querySelector('.centerblock-wrapper').classList.remove('theme');
    document.querySelector('.centerblock').classList.remove('theme');
  }
  bodyAttributesObserver.observe(document.body, { attributes: true });
}

function getLogoLang() {
  const classNames = document.querySelector('.d-logo').classList;
  const langClassName = [...classNames].find((className) => className.match(/^d-logo__\w{2}$/));
  if (!langClassName) {
    return 'en';
  }
  return langClassName.slice(-2);
}

function isCurrentThemeIsDark() {
  return document.body.classList.contains('theme-black');
}