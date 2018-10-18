const webview = document.querySelector('webview')
const ipc = require('electron').ipcRenderer
const Analytics = require('electron-ga');

webview.addEventListener('dom-ready', () => {
    document.body.classList.remove('loading')
    webview.insertCSS(`
        .d-overhead, .ads-block, .ads-block__no-ads, .bar-below, .tableau {
        display: none !important;
        }
    `)
})

ipc.on('playerCmd', (_event, playerCmd) => {
    webview.send('playerCmd', playerCmd)
})

ipc.on('playerSeek', (_event, playerCmd) => {
    webview.send('playerSeek', playerCmd)
})

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

const analytics = new Analytics.default('UA-127383106-1');
ipc.on("windowFocus", () => {
    analytics.send('screenview', { cd: 'main' })
})