const {app, Menu, BrowserWindow} = require('electron')
const settings = require('electron-settings');

app.on('ready', () => {
    const menu = Menu.buildFromTemplate([
		{
			label: app.getName(),
			submenu: [
				{role: 'about', label: 'About Yandex Music (Unofficial)'},
				{type: 'separator'},
				{role: 'services', submenu: []},
				{type: 'separator'},
				{role: 'hide', label: 'Hide Yandex Music (Unofficial)'},
				{role: 'hideothers'},
				{role: 'unhide'},
				{type: 'separator'},
				{role: 'quit', label: 'Quit Yandex Music (Unofficial)'}
			  ]
		}, {
			role: 'editMenu'
		}, {
			label: 'View',
			submenu: [
				{
					role: 'reload'
				}
			]
		}, {
			label: 'Navigate',
			submenu: [
				{
					label: 'Back',
					accelerator: 'CommandOrControl+[',
					click () {
						global.mainWindow.webContents.send('history', 'back')
					}
				}, {
					label: 'Forward',
					accelerator: 'CommandOrControl+]',
					click () {
						global.mainWindow.webContents.send('history', 'forward')
					}
				}, {
					type: 'separator'
				}, {
					label: 'Open URL',
					accelerator: 'CommandOrControl+O',
					click: showOpenURLDialog
				}
			]
		}, {
			label: 'Settings',
			submenu: [
				{
					label: 'Enable notifications',
					type: 'checkbox',
					checked: settings.get('notifications'),
					click (menuItem) {
						settings.set('notifications', menuItem.checked)
					}
				}
			]
		}, {
			role: 'windowMenu'
		}
	])
	Menu.setApplicationMenu(menu)
})

function showOpenURLDialog() {
	let win = new BrowserWindow({
		width: 440,
		height: 117,
		modal: true,
		parent: global.mainWindow,
		resizable: false
	})
	win.loadFile('src/renderer/openURL.html')
	win.show()
}