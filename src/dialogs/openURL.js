const {BrowserWindow, clipboard, ipcMain} = require('electron')

const yandexMusicUrl = "https://music.yandex.ru"
let win

exports.showOpenURLDialog = () => {
    if (win) {
        win.hide()
        win = null
        return
    }

    let clipboardString = clipboard.readText('selection')
    if (navigate(clipboardString)) {
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
    win.on('closed', () => {
        win = null
    })
}

ipcMain.on('navigate', (_event, url) => {
    if (navigate(url) && win) {
        win.close()
    }
})

function navigate(url) {
    if (url.startsWith(yandexMusicUrl)) {
        let relativeUrl = url.slice(yandexMusicUrl.length)
        global.mainWindow.webContents.send('navigate', relativeUrl)
        return true
    }
    return false
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