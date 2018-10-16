const {app, dialog, shell} = require('electron')
const {autoUpdater} = require("electron-updater");

app.on('ready', () => {
    autoUpdater.on('update-available', (info) => {
		const dmgUpdateField = info.files.find((updateFieldInfo) => {
			return updateFieldInfo.url.endsWith('.dmg')
		})
		const dmgUrl = "https://github.com/juvirez/yandex-music-app/releases/download/v" + info.version + "/" + dmgUpdateField.url
		dialog.showMessageBox(win, {
			type: 'info',
			buttons: ['cancel', 'download'],
			defaultId: 1,
			cancelId: 0,
			message: "A new version of Yandex Music is available!",
			detail: info.releaseName
		}, (response) => {
			if (response == 1) {
				shell.openExternal(dmgUrl)
			}
		})
	})
	autoUpdater.checkForUpdates()
})