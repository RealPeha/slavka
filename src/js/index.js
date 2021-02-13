window.windows = []
window.register = (w) => window.windows.push(w)

require('../windows')
require('./createWindow')

const PageState = require('./PageState')
const { $, $$ } = require('./utils')

const makers = require('./makers')

window.openedWindows = PageState.restoreOpenedWindows()
window.zIndex = 1
window.isDragging = false
window.isLargeScreen = window.innerWidth > 744

window.addEventListener('DOMContentLoaded', () => {
    makers.makeDraggable($$('.draggable'))
    makers.makeResizable($$('.resizable'))
    makers.makeFullscreen($$('.fullscreen'))
    makers.makeCentered($$('.fullscreen'))
    makers.makeOpenLink($$('[data-href]'))
    makers.makeOpenWindow($$('[data-window-id]'))

    window.openedWindows.forEach(windowId => window.createWindow(windowId, true))

    PageState.restoreState()

    window.addEventListener('beforeunload', () => {
        PageState.save()
    }, false);

    $('.loader').remove()
})
