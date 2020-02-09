let webContents = global.mainWindow.webContents;

webContents.on("dom-ready", () => {
  // ads
  webContents.insertCSS(`
    .d-overhead, .ads-block, .ads-block__no-ads, .bar-below, .tableau {
        display: none !important;
    }
  `);

  // social login
  webContents.insertCSS(`
    .passp-social-block {
      display: none !important;
    }
  `);
});
