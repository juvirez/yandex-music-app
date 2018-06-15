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

webview.addEventListener('dom-ready', () => {
    webview.insertCSS(`
        .d-overhead, .ads-block, .ads-block__no-ads, .bar-below {
            display: none !important;
        }
    `)
})