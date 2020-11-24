const { applyStyles, safeJsonParse, $, $$ } = require('./utils')
const { savePageState, restorePageState } = require('./pageState')

const makeDraggable = require('./makeDraggable')
const makeResizable = require('./makeResizable')
const makeFullscreen = require('./makeFullscreen')
const makeOpenLink = require('./makeOpenLink')
const makeOpenWindow = require('./makeOpenWindow')

const windowsManager = require('./windowsManager')

window.zIndex = 1
window.isDragging = false

const isLargeScreen = window.innerWidth > 744

const centered = (element) => {
    const setStyles = applyStyles(element)

    if (isLargeScreen) {
        setStyles({
            top: 'calc((100% - 70%) / 2)',
            left: 'calc((100% - 70%) / 2)',
        })
    } else {
        setStyles({
            top: 'calc((100% - 70%) / 2)',
            left: 'calc((100% - 90%) / 2)',
            width: '90%',
        })
    }
}

$$('.draggable').forEach(makeDraggable)
$$('.resizable').forEach(makeResizable)
$$('.fullscreen').forEach(makeFullscreen)
$$('.fullscreen').forEach(centered)
$$('[data-href]').forEach(makeOpenLink)
$$('[data-window-id]').forEach(makeOpenWindow)

const openedWindows = localStorage.getItem('openedWindows')
    ? safeJsonParse(JSON.parse(localStorage.getItem('openedWindows')), [])
    : []

windowsManager.init(openedWindows)

const state = restorePageState()

if (state) {
    window.zIndex = Math.max(...state.map(({ zIndex }) => parseInt(zIndex)).filter(Boolean))

    $$('.draggable').forEach((element, i) => {
        const elementState = state[i]

        applyStyles(element)(elementState)
    })
}

window.addEventListener('beforeunload', () => {
    savePageState()
}, false);

$('.loader').remove()
