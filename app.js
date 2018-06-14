const webview = document.querySelector('webview')

require('electron').ipcRenderer.on('mediaShortcut', (event, shortcut) => {
    webview.executeJavaScript('externalAPI.' + mediaShortcutToCommand(shortcut) + '()')
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