let webContents = global.mainWindow.webContents;

webContents.on("dom-ready", () => {
  // ads
  webContents.insertCSS(`
    .d-overhead, .ads-block, .ads-block__no-ads, .bar-below, .tableau, .branding.branding_brick {
        display: none !important;
    }
  `);

  // social login
  webContents.insertCSS(`
    .AuthSocialButton,
    .AuthSocialBlock-provider[data-t="provider:primary:vk"],
    .AuthSocialBlock-provider[data-t="provider:primary:fb"],
    .AuthSocialBlock-provider[data-t="provider:primary:gg"],
    .AuthSocialBlock-provider[data-t="provider:more"] {
      display: none !important;
    }
  `);


  const animationsDisabled = global.store.get('animations_disabled', true);
  // music visualizer animation
  if (animationsDisabled) {
    webContents.insertCSS(`
      .rup__animation .audio-animation__fallback {
        display: none !important;
      }
    `);
  }

  // scrollbar for dark mode
  webContents.insertCSS(`
    @media (prefers-color-scheme: dark) {
      html {
        color-scheme: dark;
      }
    }
    @media (prefers-color-scheme: light) {
      html {
        color-scheme: light;
      }
    }
  `);
});
