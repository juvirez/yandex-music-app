const {app, BrowserWindow} = require('electron')
const settings = require('electron-settings');

let win
let willQuitApp = false

app.on('before-quit', () => willQuitApp = true);
app.on('activate', () => {
	if (win) {
		win.show()
	}
})

app.on('ready', () => {
	win = new BrowserWindow({width: 1301, height: 768, title: 'Yandex Music'})
	win.loadFile('src/renderer/index.html')
	global.mainWindow = win

	require('./features')

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
})