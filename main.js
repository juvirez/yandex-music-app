const {app, BrowserWindow, globalShortcut} = require('electron')

let win
let willQuitApp = false

function createWindow () {
	win = new BrowserWindow({width: 1301, height: 768, title: 'Yandex Music'})
	win.loadFile('index.html')
	
	win.on('close', e => {
		if (willQuitApp) {
			win = null
		} else {
			e.preventDefault();
			win.hide()
		}
	})
}

app.on('before-quit', () => willQuitApp = true);
app.on('activate', () => win.show())

app.on('ready', () => {
	createWindow()

	for (const shortcut of ['MediaNextTrack', 'MediaPreviousTrack', 'MediaStop', 'MediaPlayPause']) {
		globalShortcut.register(shortcut, () => {
			if (win !== null) {
				win.webContents.send('mediaShortcut', shortcut);
			}
		});
	}
})