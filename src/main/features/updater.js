const { app, dialog, shell } = require("electron");
const GitHub = require("github-api");
const semver = require("semver");

const github = new GitHub();
github
  .getRepo("juvirez", "yandex-music-app")
  .listReleases()
  .then(({ data }) => {
    let lastRelease = data.find((release) => {
      return !release.prerelease;
    });
    if (semver.gt(lastRelease.tag_name, app.getVersion())) {
      let downloadUrl = getDownloadUrl(lastRelease);
      dialog.showMessageBox(
        global.mainWindow,
        {
          type: "info",
          buttons: ["cancel", "download"],
          defaultId: 1,
          cancelId: 0,
          message: "A new version of Yandex Music is available!",
          detail: lastRelease.name + "\n\n" + lastRelease.body,
        },
        (response) => {
          if (response == 1) {
            shell.openExternal(downloadUrl);
          }
        }
      );
    }
  })
  .catch((error) => {
    console.warn("Cannot fetch releases from github:", error.response.status);
  });

function getDownloadUrl(release) {
  if (process.platform === "darwin") {
    return release.assets.find((asset) => {
      return asset.name.endsWith(".dmg");
    }).browser_download_url;
  } else {
    return release.html_url;
  }
}
