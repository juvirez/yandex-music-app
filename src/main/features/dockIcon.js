const { app } = require("electron");

setDockVisibility(!global.store.get("hide-dock-icon", false))

global.store.onDidChange("hide-dock-icon", (newValue) => {
  setDockVisibility(!newValue);
});

function setDockVisibility(visible) {
  if (visible) {
    app.dock.show();
  } else {
    app.dock.hide();
  }
}