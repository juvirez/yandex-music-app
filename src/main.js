const {app, BrowserWindow, globalShortcut} = require('electron')
const settings = require('electron-settings');
require('./menu')
require('./updater')

let win
let willQuitApp = false

function createWindow () {
	win = new BrowserWindow({width: 1301, height: 768, title: 'Yandex Music'})
	win.loadFile('src/renderer/index.html')

	win.on('close', e => {
		if (willQuitApp) {
			win = null
		} else {
			e.preventDefault();
			win.hide()
		}
	})

	win.on('focus', () => {
		win.webContents.send('windowFocus')
	})

}

app.on('before-quit', () => willQuitApp = true);
app.on('activate', () => win.show())

app.on('ready', () => {
	if (!settings.has('notifications')) {
		settings.set('notifications', true)
	}

	createWindow()

	for (const shortcut of ['MediaNextTrack', 'MediaPreviousTrack', 'MediaStop', 'MediaPlayPause']) {
		globalShortcut.register(shortcut, () => {
			if (win !== null) {
				win.webContents.send('mediaShortcut', shortcut);
			}
		});
	}
})