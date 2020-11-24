const {
    addEventListeners,
    removeEventListeners,
    getPageCoords,
    createDiv,
    applyStyles,
    safeJsonParse,
} = require('./utils')
const windows = require('./windows')
const {
    savePageState,
    restorePageState,
} = require('./pageState')

const makeDraggable = require('./makeDraggable')
const makeResizable = require('./makeResizable')
const makeFullscreen = require('./makeFullscreen')
const makeOpenLink = require('./makeOpenLink')
const makeOpenWindow = require('./makeOpenWindow')

const windowsContainer = document.querySelector('.content-wrapper')

const openedWindows = localStorage.getItem('openedWindows')
    ? safeJsonParse(JSON.parse(localStorage.getItem('openedWindows')), [])
    : []

window.zIndex = 1
window.isDragging = false
let isLargeScreen = window.innerWidth > 744

const createItem = (parent, item) => {
    const { title = '', windowId, type, href } = item

    const itemWrapper = createDiv(parent, ['item', type])
    const itemContent = createDiv(itemWrapper, ['item-content'])

    itemContent.innerText = title

    if (windowId) {
        itemWrapper.dataset.windowId = windowId
    }

    if (href) {
        itemWrapper.dataset.href = href
    }

    return itemWrapper
}

const defaultFeatures = {
    resizable: true,
    draggable: true,
    fullscreen: true,
    title: true,
}

const createWindow = (id, ignoreOpened = false) => {
    if (openedWindows.includes(id) && !ignoreOpened) {
        return
    }

    if (!ignoreOpened) {
        openedWindows.push(id)
    }

    const windowData = windows.find(window => window.id === id) || {
        title: '404',
        content: 'Not Found',
    }

    const {
        title = '',
        content = '',
        contentSrc,
        items,
        itemsSort,
        styles,
        features,
    } = windowData

    const windowFeatures = {
        ...defaultFeatures,
        ...features,
    }

    const windowWrapper = createDiv(windowsContainer, ['window', 'resizable', 'draggable', 'fullscreen'])
    const titleWrapper = createDiv(windowWrapper, ['title-wrapper', 'drag-target'])
    const contentDiv = createDiv(windowWrapper, ['content'])

    const close = (e) => {
        e.preventDefault()

        applyStyles(windowWrapper)({ opacity: 0 })

        setTimeout(() => {
            windowWrapper.remove()
            openedWindows.splice(openedWindows.indexOf(id), 1)
        }, 200)
    }

    if (windowFeatures.title) {
        const titleDiv = createDiv(titleWrapper, ['title', 'really-cool-border'])
        const titleContent = createDiv(titleDiv)
        const titleClose = createDiv(titleWrapper, ['window-close'])

        addEventListeners(titleClose, ['mousedown'], close)

        titleContent.innerText = title
    } else {
        addEventListeners(titleWrapper, ['contextmenu'], close)
    }

    if (contentSrc) {
        fetch(contentSrc)
            .then(res => res.text())
            .then(html => {
                contentDiv.innerHTML = html

                const scripts = contentDiv.getElementsByTagName('script')

                scripts.forEach(script => {
                    if (script.src) {
                        const tag = document.createElement('script')
                        tag.src = script.src
                        document.getElementsByTagName('head')[0].appendChild(tag)
                    } else {
                        eval(script.innerHTML)
                    }
                })
            })
    } else {
        contentDiv.innerHTML = content
    }

    if (items && items.length) {
        const itemsWrapper = createDiv(contentDiv, ['items-wrapper'])

        if (itemsSort) {
            items.sort(itemsSort)
        }

        items.forEach(item => {
            const createdItem = createItem(itemsWrapper, item)

            if (item.href) {
                makeOpenLink([createdItem])
            } else if (item.windowId) {
                makeOpenWindow([createdItem])
            }
        })
    }

    windowFeatures.draggable && makeDraggable([windowWrapper])
    windowFeatures.resizable && makeResizable([windowWrapper])
    windowFeatures.fullscreen && makeFullscreen([windowWrapper])
    makeCentered([windowWrapper])

    new SimpleBar(contentDiv)

    const applyWindowStyles = applyStyles(windowWrapper)

    applyWindowStyles({
        ...(styles || {}),
        zIndex: ++window.zIndex,
        opacity: 1,
    })
}

const makeCentered = (elements) => elements.forEach(element => {
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
})

makeDraggable(document.querySelectorAll('.draggable'))
makeResizable(document.querySelectorAll('.resizable'))
makeFullscreen(document.querySelectorAll('.fullscreen'))
makeCentered(document.querySelectorAll('.fullscreen'))
makeOpenLink(document.querySelectorAll('[data-href]'))
makeOpenWindow(document.querySelectorAll('[data-window-id]'))

openedWindows.forEach(windowId => createWindow(windowId, true))

const state = restorePageState()

if (state) {
    window.zIndex = Math.max(...state.map(({ zIndex }) => parseInt(zIndex)).filter(Boolean))

    const elements = document.querySelectorAll('.draggable')

    elements.forEach((element, i) => {
        const elementState = state[i]

        applyStyles(element)(elementState)
    })
}

window.addEventListener('beforeunload', () => {
    savePageState()
}, false);

document.querySelector('.loader').remove()
