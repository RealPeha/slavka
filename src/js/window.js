const { createDiv, applyStyles, $, addEventListeners } = require('./utils')
const makers = require('./makers')

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

    set(prop, value) {
        this[prop] = value

        return this
    }

    title(title) {
        return this.set('_title', title)
    }

    content(content) {
        return this.set('_content', content)
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
    
            addEventListeners(titleClose, ['mousedown'], (e) => window.windowManager.close(e), { once: true })
    
            titleContent.innerText = _title
        } else {
            addEventListeners(titleWrapper, ['contextmenu'], (e) => window.windowManager.close(e), { once: true })
        }
    
        if (_contentSrc) {
            fetch(_contentSrc)
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
            contentWrapper.innerHTML = _content
        }
    
        if (_items && _items.length) {
            const itemsWrapper = createDiv(contentWrapper, ['items-wrapper'])
    
            if (_itemsSort) {
                _items.sort(_itemsSort)
            }
    
            _items.forEach(item => {
                const createdItem = createItem(itemsWrapper, item)
    
                if (item.href) {
                    makers.makeOpenLink(createdItem)
                } else if (item.windowId) {
                    makers.makeOpenWindow(createdItem)
                }
            })
        }
    
        features.draggable && makers.makeDraggable(windowWrapper)
        features.resizable && makers.makeResizable(windowWrapper)
        features.fullscreen && makers.makeFullscreen(windowWrapper)
    
        makers.makeCentered(windowWrapper)
    
        new SimpleBar(contentWrapper)
    
        const applyWindowStyles = applyStyles(windowWrapper)
    
        applyWindowStyles({
            ...(_styles || {}),
            zIndex: ++window.zIndex,
            opacity: 1,
        })
    }

    close(e = {}) {
        e && e.preventDefault()

        applyStyles(this.windowWrapper)({ opacity: 0 })

        setTimeout(() => {
            this.windowWrapper.remove()
        }, 200)
    }
}

module.exports = Window
