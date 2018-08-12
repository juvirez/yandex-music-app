const ipc = require('electron').ipcRenderer

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
        loginButton.addEventListener('click', () => {
            window.location = loginButton.href
        })
 });

ipc.on('playerCmd', (event, cmd) => {
    window.externalAPI[cmd]()
})