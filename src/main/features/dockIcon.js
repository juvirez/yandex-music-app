const { app } = require("electron");

setDockIconVisible(isDockIconVisible())

global.store.onDidChange("hide-dock-icon", (newValue) => {
  setDockIconVisible(!newValue);
});

function setDockIconVisible(visible) {
  global.store.set("hide-dock-icon", !visible);
  if (visible) {
    app.dock.show();
  } else {
    app.dock.hide();
  }
};

function isDockIconVisible() {
  return !global.store.get("hide-dock-icon", false);
}

exports.isDockIconVisible = isDockIconVisible;
exports.setDockIconVisible = setDockIconVisible;