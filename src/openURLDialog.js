const {BrowserWindow} = require('electron')

let win

exports.showOpenURLDialog = () => {
    if (win) {
        win.hide()
        win = null
        return
    }
    win = createWindow()
    win.once('ready-to-show', () => {
        win.show()
    })
    win.once('blur', () => {
        win.hide()
        win = null
    })
}

function createWindow() {
	let win = new BrowserWindow({
		width: 440,
		height: 117,
		modal: true,
		parent: global.mainWindow,
        resizable: false,
        show: false
	})
    win.loadFile('src/renderer/openURL.html')
    return win
}