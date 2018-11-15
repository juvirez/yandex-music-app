const {app, dialog, shell} = require('electron')
const GitHub = require('github-api')

app.on('ready', () => {
	const github = new GitHub()
	github.getRepo('juvirez', 'yandex-music-app').listReleases((_err, releases) => {
		let lastRelease = releases.find((release) => {
			return !release.draft
		})
		if (lastRelease.tag_name !== 'v' + app.getVersion()) {
			let downloadUrl = getDownloadUrl(lastRelease)
			dialog.showMessageBox(global.mainWindow, {
				type: 'info',
				buttons: ['cancel', 'download'],
				defaultId: 1,
				cancelId: 0,
				message: "A new version of Yandex Music is available!",
				detail: lastRelease.name + '\n\n' + lastRelease.body
			}, (response) => {
				if (response == 1) {
					shell.openExternal(downloadUrl)
				}
			})
		}
	})
})

function getDownloadUrl(release) {
	if (process.platform === 'darwin') {
		return release.assets.find((asset) => {
			return asset.name.endsWith('.dmg').browser_download_url
		})
	} else {
		return release.html_url
	}
}