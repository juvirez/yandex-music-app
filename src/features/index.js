require('./menu')
require('./updater')

if (process.platform == 'darwin') {
    require('./mediaService')
} else {
    require('./shortcuts')
}