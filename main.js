const {app, BrowserWindow, globalShortcut, Menu} = require('electron')

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

	initMenu()
})

function initMenu() {
	const menu = Menu.buildFromTemplate([
		{
			label: app.getName(),
			submenu: [
				{
					label: 'Quit Yandex Music',
					role: 'quit'
				}
			]
		}, {
			label: 'View',
			submenu: [
				{
					role: 'reload'
				}
			]
		}, {
			label: 'History',
			submenu: [
				{
					label: 'Back',
					accelerator: 'CommandOrControl+[',
					click () {
						win.webContents.send('history', 'back')
					}
				}, {
					label: 'Forward',
					accelerator: 'CommandOrControl+]',
					click () {
						win.webContents.send('history', 'forward')
					}
				}
			]
		}
	])
	Menu.setApplicationMenu(menu)
}