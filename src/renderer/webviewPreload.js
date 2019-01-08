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
        window.location = "https://passport.yandex.ru/auth?origin=music&retpath=https%3A%2F%2Fmusic.yandex.ru"
    })

    externalAPI.on(externalAPI.EVENT_TRACK, () => {
        const track = externalAPI.getCurrentTrack()
        if (settings.get('notifications', true) && externalAPI.isPlaying()) {
            new Notification(track.title, {
                body: track.artists.map(a => a.title).join(', '),
                icon: "https://" + track.cover.replace('%%', '100x100'),
                silent: true
            })
        }
        ipc.send('changeTrack', track)
    })

    externalAPI.on(externalAPI.EVENT_PROGRESS, () => {
        ipc.send('changeProgress', externalAPI.getProgress())
    })

    externalAPI.on(externalAPI.EVENT_STATE, () => {
        ipc.send('changeState', {
            isPlaying: externalAPI.isPlaying()
        })
    })
 })

ipc.on('playerCmd', (_event, cmd) => {
    if (cmd == 'play') {
        externalAPI.togglePause(false)
    } else if (cmd == 'pause') {
        externalAPI.togglePause(true)
    } else {
        externalAPI[cmd]()
    }
})

ipc.on('playerSeek', (_event, to) => {
    externalAPI.setPosition(to)
})

ipc.on('navigate', (_event, url) => {
    externalAPI.navigate(url)
})