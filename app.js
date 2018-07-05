const webview = document.querySelector('webview')
const ipc = require('electron').ipcRenderer

ipc.on('mediaShortcut', (event, shortcut) => {
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

ipc.on('history', (event, action) => {
    switch(action) {
        case 'back':
            webview.goBack()
            break
        case 'forward':
            webview.goForward()
            break
    }
})

webview.addEventListener('dom-ready', () => {
    webview.insertCSS(`
        .d-overhead, .ads-block, .ads-block__no-ads, .bar-below, .tableau {
            display: none !important;
        }
    `)
    webview.executeJavaScript(`
        let bodyAttributesObserver = new MutationObserver((mutationsList) => {
            for (var mutation of mutationsList) {
                let bodyClasses = document.body.classList
                if (mutation.attributeName == 'class' && bodyClasses.contains('body_bar-tall')) {
                    bodyClasses.remove('body_bar-tall')
                }
            }
        })
        bodyAttributesObserver.observe(document.body, { attributes: true })
    `)
    webview.executeJavaScript(`
        let loginButton = document.querySelector('.log-in')
        loginButton.addEventListener('click', () => {
            window.location = loginButton.href
        })
    `)
})