const {app, globalShortcut} = require('electron')

app.on('ready', () => {
	for (const shortcut of ['MediaNextTrack', 'MediaPreviousTrack', 'MediaStop', 'MediaPlayPause']) {
		globalShortcut.register(shortcut, () => {
			if (global.mainWindow !== null) {
				global.mainWindow.webContents.send('playerCmd', mediaShortcutToCommand(shortcut));
			}
		});
	}
})

function mediaShortcutToCommand(shortcut) {
    switch(shortcut) {
        case 'MediaNextTrack':
            return 'next'
        case 'MediaPreviousTrack':
            return 'prev'
        case 'MediaStop':
            return 'stop'
        case 'MediaPlayPause':
            return 'togglePause'
    }
}