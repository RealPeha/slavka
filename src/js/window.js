const { createDiv, applyStyles } = require('./utils')

const makeDraggable = require('./makeDraggable')
const makeResizable = require('./makeResizable')
const makeFullscreen = require('./makeFullscreen')
const makeOpenLink = require('./makeOpenLink')
const makeOpenWindow = require('./makeOpenWindow')

const defaultFeatures = {
    resizable: true,
    draggable: true,
    fullscreen: true,
    title: true,
}

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

class Window {
    constructor(id) {
        this.id = id
        this._title = ''
        this._items = []
        this._content = ''
        this._contentSrc = null
        this._itemsSort = null
        this._styles = null
        this._features = null
    }

    title(text) {
        this._title = text

        return this
    }

    items(itemsArr, itemsSort) {
        this._items = itemsArr
        this._itemsSort = itemsSort

        return this
    }

    render() {
        const {
            _title,
            _content,
            _contentSrc,
            _items,
            _itemsSort,
            _styles,
            _features,
        } = this
    
        const features = {
            ...defaultFeatures,
            ..._features,
        }
    
        const windowsContainer = $('.content-wrapper')

        const windowWrapper = createDiv(windowsContainer, ['window', 'resizable', 'draggable', 'fullscreen'])
        const titleWrapper = createDiv(windowWrapper, ['title-wrapper', 'drag-target'])
        const contentWrapper = createDiv(windowWrapper, ['content'])

        this.windowWrapper = windowWrapper
        this.titleWrapper = titleWrapper
        this.contentWrapper = contentWrapper
    
        if (features.title) {
            const titleDiv = createDiv(titleWrapper, ['title', 'really-cool-border'])
            const titleContent = createDiv(titleDiv)
            const titleClose = createDiv(titleWrapper, ['window-close'])
    
            addEventListeners(titleClose, ['mousedown'], close, { once: true })
    
            titleContent.innerText = title
        } else {
            addEventListeners(titleWrapper, ['contextmenu'], close, { once: true })
        }
    
        if (contentSrc) {
            fetch(contentSrc)
                .then(res => res.text())
                .then(html => {
                    contentWrapper.innerHTML = html
    
                    const scripts = contentWrapper.getElementsByTagName('script')
    
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
            contentWrapper.innerHTML = content
        }
    
        if (items && items.length) {
            const itemsWrapper = createDiv(contentWrapper, ['items-wrapper'])
    
            if (itemsSort) {
                items.sort(itemsSort)
            }
    
            items.forEach(item => {
                const createdItem = createItem(itemsWrapper, item)
    
                if (item.href) {
                    makeOpenLink(createdItem)
                } else if (item.windowId) {
                    makeOpenWindow(createdItem)
                }
            })
        }
    
        features.draggable && makeDraggable(windowWrapper)
        features.resizable && makeResizable(windowWrapper)
        features.fullscreen && makeFullscreen(windowWrapper)
    
        centered(windowWrapper)
    
        new SimpleBar(contentWrapper)
    
        const applyWindowStyles = applyStyles(windowWrapper)
    
        applyWindowStyles({
            ...(styles || {}),
            zIndex: ++window.zIndex,
            opacity: 1,
        })
    }

    close(e = {}) {
        e.preventDefault()

        applyStyles(this.windowWrapper)({ opacity: 0 })

        setTimeout(() => {
            this.windowWrapper.remove()
        }, 200)
    }
}

module.exports = Window
