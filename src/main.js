const {app, BrowserWindow} = require('electron')
const settings = require('electron-settings');
require('./menu')
require('./updater')
require('./mediaService')

let win
let willQuitApp = false

app.on('before-quit', () => willQuitApp = true);
app.on('activate', () => win.show())

app.on('ready', () => {
	require('./shortcuts')
	win = new BrowserWindow({width: 1301, height: 768, title: 'Yandex Music'})
	win.loadFile('src/renderer/index.html')
	global.mainWindow = win

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

if (!settings.has('notifications')) {
	settings.set('notifications', true)
}