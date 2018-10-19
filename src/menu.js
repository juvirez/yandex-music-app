const {app, Menu} = require('electron')
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
			label: 'History',
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