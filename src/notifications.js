const {app} = require('electron')
const settings = require('electron-settings');

app.on('ready', () => {
	if (!settings.has('notifications')) {
		settings.set('notifications', true)
    }
})