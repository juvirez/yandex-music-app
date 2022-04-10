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
    .passp-social-block, .passp-social-button {
      display: none !important;
    }
  `);

  // music visualizer animation
  webContents.insertCSS(`
    .rup__animation .audio-animation__fallback {
      display: none !important;
    }
  `);
});
