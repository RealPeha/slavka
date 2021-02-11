const { applyStyles, $, $$ } = require('./utils')
const PageState = require('./PageState')
const makers = require('./makers')

window.windowsManager = require('./WindowsManager')
window.zIndex = 1
window.isDragging = false

$$('.draggable').forEach(makers.makeDraggable)
$$('.resizable').forEach(makers.makeResizable)
$$('.fullscreen').forEach(makers.makeFullscreen)
$$('.fullscreen').forEach(makers.makeCentered)
$$('[data-href]').forEach(makers.makeOpenLink)
$$('[data-window-id]').forEach(makers.makeOpenWindow)

const state = PageState.restoreState()

if (state) {
    window.zIndex = Math.max(...state.map(({ zIndex }) => parseInt(zIndex)).filter(Boolean))

    $$('.draggable').forEach((element, i) => {
        applyStyles(element)(state[i])
    })
}

window.addEventListener('beforeunload', () => {
    PageState.save()
}, false);

$('.loader').remove()
