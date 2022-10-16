const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  refreshTheme();
  
  let bodyAttributesObserver = new MutationObserver(refreshTheme);
  bodyAttributesObserver.observe(document.body, { attributes: true });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', refreshTheme);
});

async function refreshTheme() {
  const syncTheme = await ipcRenderer.invoke('getStoreValue', 'sync-theme', true);
  if (!syncTheme) {
    return;
  }

  const darkClassNames = ['theme', 'black', 'theme-black', 'icon-theme-black'];
  const lightClassNames = ['theme-white', 'icon-theme-white'];
  const logoDarkClassNames = ['d-logo__white', 'd-logo__white__' + getLogoLang()];

  const osThemeIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (osThemeIsDark) {
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
}

function getLogoLang() {
  const classNames = document.querySelector('.d-logo').classList;
  const langClassName = [...classNames].find((className) => className.match(/^d-logo__\w{2}$/));
  if (!langClassName) {
    return 'en';
  }
  return langClassName.slice(-2);
}
