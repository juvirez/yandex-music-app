const ipc = require('electron').ipcRenderer
const settings = require('electron-settings');

document.addEventListener('DOMContentLoaded', () => {
    let bodyAttributesObserver = new MutationObserver((mutationsList) => {
        for (var mutation of mutationsList) {
            let bodyClasses = document.body.classList
            if (mutation.attributeName == 'class' && bodyClasses.contains('body_bar-tall')) {
                bodyClasses.remove('body_bar-tall')
            }
        }
    })
    bodyAttributesObserver.observe(document.body, { attributes: true })

    let loginButton = document.querySelector('.log-in')
    loginButton && loginButton.addEventListener('click', () => {
        window.location = loginButton.href
    })

    window.externalAPI.on(window.externalAPI.EVENT_TRACK, () => {
        const track = window.externalAPI.getCurrentTrack()
        if (settings.get('notifications') && window.externalAPI.isPlaying()) {
            new Notification(track.title, {
                body: track.artists.map(a => a.title).join(', '),
                icon: "https://" + track.cover.replace('%%', '100x100'),
                silent: true
            })
        }
    })
 })

 ipc.on('playerCmd', (event, cmd) => {
    window.externalAPI[cmd]()
})