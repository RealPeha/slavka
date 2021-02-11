const {
    $,
    addEventListeners,
    createDiv,
    applyStyles,
} = require('./utils')

const makers = require('./makers')

const windowsContainer = $('.content-wrapper')
const cachedWindows = new Map()

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

window.createWindow = (id, ignoreOpened = false) => {
    if (window.openedWindows.includes(id) && !ignoreOpened) {
        return
    }

    const defaultFeatures = {
        resizable: true,
        draggable: true,
        fullscreen: true,
        title: true,
    }

    if (!ignoreOpened) {
        window.openedWindows.push(id)
    }

    const windowData = window.windows.find(window => window.id === id) || {
        title: '404',
        content: 'Not Found',
    }

    const {
        title = '',
        content = '',
        load,
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
            window.openedWindows.splice(window.openedWindows.indexOf(id), 1)
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

    if (load) {
        const runScripts = () => {
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
        }

        if (cachedWindows.has(load)) {
            contentDiv.innerHTML = cachedWindows.get(load)

            runScripts()
        } else {
            fetch(load)
                .then(res => res.text())
                .then(html => {
                    contentDiv.innerHTML = html

                    cachedWindows.set(load, html)

                    runScripts()
                })
        }
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
                makers.makeOpenLink([createdItem])
            } else if (item.windowId) {
                makers.makeOpenWindow([createdItem])
            }
        })
    }

    windowFeatures.draggable && makers.makeDraggable([windowWrapper])
    windowFeatures.resizable && makers.makeResizable([windowWrapper])
    windowFeatures.fullscreen && makers.makeFullscreen([windowWrapper])
    makers.makeCentered([windowWrapper])

    new SimpleBar(contentDiv)

    const applyWindowStyles = applyStyles(windowWrapper)

    applyWindowStyles({
        ...(styles || {}),
        zIndex: ++window.zIndex,
        opacity: 1,
    })
}
