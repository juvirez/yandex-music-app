const {BrowserWindow, clipboard} = require('electron')

const yandexMsuciUrl = "https://music.yandex.ru"
let win

exports.showOpenURLDialog = () => {
    if (win) {
        win.hide()
        win = null
        return
    }

    let clipboardString = clipboard.readText('selection')
    if (clipboardString.startsWith(yandexMsuciUrl)) {
        let relativeUrl = clipboardString.slice(yandexMsuciUrl.length)
        global.mainWindow.webContents.send('navigate', relativeUrl)
        return
    }

    win = createWindow()
    win.once('ready-to-show', () => {
        win.show()
    })
    win.once('blur', () => {
        if (win) {
            win.hide()
            win = null
        }
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