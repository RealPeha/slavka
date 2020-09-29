let zIndex = 1
let isDragging = false
let isLargeScreen = window.innerWidth > 744

const windowsContainer = document.querySelector('.content-wrapper')

const openedWindows = []

const windows = [
    {
        id: 'mine',
        title: 'Minecraft',
        items: [
            {
                type: 'folder',
                title: 'Test',
                windowId: 'test'
            },
            {
                type: 'file',
                title: 'File',
                href: '/mine',
            },
        ],
        itemsSort: (a, b) => a.type < b.type // folder first
        // itemsSort: (a, b) => a.type > b.type // file first
    },
    {
        id: 'toe',
        title: 'Wantid',
        content: `
            Согласен
        `.trim()
    },
]

const addEventListeners = (element, events, handler, options = {}) => {
    events.forEach(event => element.addEventListener(event, handler, options))
}

const removeEventListeners = (element, events, handler) => {
    events.forEach(event => element.removeEventListener(event, handler))
}

const getPageCoords = ({ changedTouches, pageX, pageY }) => {
    if (changedTouches) {
        const [touch] = changedTouches

        return {
            pageX: touch.pageX,
            pageY: touch.pageY,
        }
    }

    return { pageX, pageY }
}

const createDiv = (parent, classList) => {
    const div = document.createElement('div')

    if (classList) {
        div.classList.add(...classList)
    }

    parent.appendChild(div)

    return div
}

const createItem = (parent, item) => {
    const itemWrapper = createDiv(parent, ['item', item.type])
    const itemContent = createDiv(itemWrapper, ['item-content'])

    itemContent.innerText = item.title || ''

    if (item.windowId) {
        itemWrapper.dataset.windowId = item.windowId
    }

    if (item.href) {
        itemWrapper.dataset.href = item.href
    }

    return itemWrapper
}

const createWindow = (id) => {
    if (openedWindows.includes(id)) {
        return
    }

    openedWindows.push(id)

    const windowData = windows.find(window => window.id === id) || { title: '404', content: 'Not Found' }
    
    const windowWrapper = createDiv(windowsContainer, ['window', 'resizable', 'draggable', 'fullscreen'])
    const titleWrapper = createDiv(windowWrapper, ['title-wrapper', 'drag-target'])
    const content = createDiv(windowWrapper, ['content'])
    const title = createDiv(titleWrapper, ['title', 'really-cool-border'])
    const titleContent = createDiv(title)
    const titleClose = createDiv(titleWrapper, ['window-close'])

    titleClose.addEventListener('mousedown', e => {
        windowWrapper.remove()
        openedWindows.splice(openedWindows.indexOf(id), 1)
    })

    titleContent.innerText = windowData.title || ''
    content.innerText = windowData.content || ''

    if (windowData.items && windowData.items.length) {
        const itemsWrapper = createDiv(content, ['items-wrapper'])

        if (windowData.itemsSort) {
            windowData.items.sort(windowData.itemsSort)
        }
        windowData.items.forEach(item => {
            const createdItem = createItem(itemsWrapper, item)

            if (item.href) {
                makeLink([createdItem])
            } else if (item.windowId) {
                makeCanOpenWindow([createdItem])
            }
        })
    }

    makeDraggable([windowWrapper])
    makeResizable([windowWrapper])
    makeFullscreen([windowWrapper])

    const applyWindowStyles = applyStyles(windowWrapper)

    applyWindowStyles({ zIndex: ++zIndex })

    if (windowData.sizes) {
        applyWindowStyles({
            width: windowData.sizes.width,
            height: windowData.sizes.height,
            ...(windowData.sizes.top && { top: windowData.sizes.top }),
            ...(windowData.sizes.left && { left: windowData.sizes.left }),
        })
    }
}

const applyStyles = (element) => (styles = {}) => {
    Object.entries(styles).forEach(([property, value]) => {
        element.style[property] = value.toString()
    })
}

const setBodyStyles = applyStyles(document.body)

const makeDraggable = (draggableElements) => {
    draggableElements.forEach(draggableElement => {
        const dragTargets = draggableElement.querySelectorAll('.drag-target') || [draggableElement]
        const setDraggableStyles = applyStyles(draggableElement)
        
        dragTargets.forEach(dragTarget => {
            addEventListeners(dragTarget, ['mousedown', 'touchstart'], e => {
                if (!e.target.classList.contains('drag-target')) {
                    return
                }
    
                const mouseClick = getPageCoords(e)

                setBodyStyles({ userSelect: 'none' })
                setDraggableStyles({ zIndex: ++zIndex })

                const styles = window.getComputedStyle(draggableElement, null)

                const left = parseInt(styles.getPropertyValue('left')) || 0
                const top = parseInt(styles.getPropertyValue('top')) || 0
    
                const handleMouseMove = e => {
                    isDragging = true
                    
                    const { pageX, pageY } = getPageCoords(e)

                    setDraggableStyles({
                        left: left + pageX - mouseClick.pageX + 'px',
                        top: top + pageY - mouseClick.pageY + 'px',
                    })
                }

                const handleMouseUp = () => {
                    removeEventListeners(document, ['mousemove', 'touchmove'], handleMouseMove)
                    setBodyStyles({ userSelect: 'auto' })
                    isDragging = false
                }
    
                addEventListeners(document, ['mousemove', 'touchmove'], handleMouseMove)
                addEventListeners(document, ['mouseup', 'touchend'], handleMouseUp, { once: true })
    
                dragTarget.ondragstart = () => false
            })
        })
    })
}

const createResizer = (type, parent) => {
    const resizer = document.createElement('div')
    resizer.classList.add('resizer', ...(Array.isArray(type) ? type : type.split(' ')))
    parent.appendChild(resizer)

    return resizer
}

const createResizers = (types, container) => {
    return types.map(type => createResizer(type, container))
}

const makeResizable = (resizableElements) => {
    resizableElements.forEach(resizableElement => {
        const setResizeStyles = applyStyles(resizableElement)

        const resizersContainer = document.createElement('div')
        resizableElement.appendChild(resizersContainer)

        const resizers = createResizers(
            ['top', 'right', 'bottom', 'left', 'top left', 'top right', 'bottom left', 'bottom right'],
            resizersContainer
        )

        let mouseClick = {}
        let offset = { top: 0, left: 0 }
        let rect = {}

        const resizeTop = (e) => {
            const { pageY } = getPageCoords(e)

            setResizeStyles({ height: rect.height + (mouseClick.pageY - pageY) + 'px' })

            if (!isLargeScreen) {
                setResizeStyles({ top: offset.top + (pageY - mouseClick.pageY) + 'px' })
            } else {
                setResizeStyles({ top: pageY + 'px' })
            }
        }

        const resizeRight = (e) => {
            const { pageX } = getPageCoords(e)

            setResizeStyles({ width: pageX - rect.left + 'px' })
        }

        const resizeBottom = (e) => {
            const { pageY } = getPageCoords(e)

            setResizeStyles({ height: pageY - rect.top + 'px' })
        }

        const resizeLeft = (e) => {
            const { pageX } = getPageCoords(e)

            setResizeStyles({
                width: rect.width + (mouseClick.pageX - pageX) + 'px',
                left: pageX + 'px',
            })
        }

        resizers.forEach(resizer => {
            const classes = resizer.classList

            const resize = (e) => {
                classes.contains('top') && resizeTop(e)
                classes.contains('right') && resizeRight(e)
                classes.contains('bottom') && resizeBottom(e)
                classes.contains('left') && resizeLeft(e)
            }
    
            const stopResize = () => {
                removeEventListeners(window, ['mousemove', 'touchmove'], resize)
            }

            addEventListeners(resizer, ['mousedown', 'touchstart'], (e) => {
                mouseClick = getPageCoords(e)
                rect = resizableElement.getBoundingClientRect()
                offset = {
                    top: resizableElement.offsetTop,
                    left: resizableElement.offsetLeft,
                }
                
                addEventListeners(window, ['mousemove', 'touchmove'], resize)
                addEventListeners(window, ['mouseup', 'touchend'], stopResize)
            })
        })
    })
}

const makeFullscreen = (fullscreenElements) => {
    const styles = {
        top: 'calc((100% - 70%) / 2)',
        left: 'calc((100% - 70%) / 2)',
    }

    fullscreenElements.forEach(fullscreenElement => {
        const setFullscreenStyles = applyStyles(fullscreenElement)

        if (isLargeScreen) {
            setFullscreenStyles({
                ...styles,
                width: `${fullscreenElement.getBoundingClientRect().width}px`,
            })
        } else {
            setFullscreenStyles({
                ...styles,
                width: '90%',
                margin: 0,
            })
        }

        let clickCount = 0
        let isFullscreen = false
        let rect = {}

        addEventListeners(fullscreenElement, ['mousedown'], () => {
            clickCount++
            
            if (clickCount >= 2) {     
                setFullscreenStyles({ transition: 'left .1s, top .1s, width .1s, height .1s' })
            
                if (!isFullscreen) {
                    const { width, height } = fullscreenElement.getBoundingClientRect()

                    rect = {
                        width,
                        height,
                        top: fullscreenElement.offsetTop,
                        left: fullscreenElement.offsetLeft,
                    }

                    isFullscreen = true

                    setFullscreenStyles({
                        width: '100%', height: '100%',
                        left: 0, top: 0,
                    })
                } else {
                    isFullscreen = false

                    setFullscreenStyles({
                        width: `${rect.width}px`,
                        height: `${rect.height}px`,
                        left: `${rect.left}px`,
                        top: `${rect.top}px`,
                    })
                }

                setTimeout(() => setFullscreenStyles({ transition: 'none' }), 100)
            }

            setTimeout(() => clickCount = 0, 200)
        })
    })
}

const makeLink = (linkElements) => {
    linkElements.forEach(linkElement => {
        const href = linkElement.dataset.href

        if (href) {
            addEventListeners(linkElement, ['mouseup', 'touchend'], () => {
                if (!isDragging) {
                    window.location.href = href
                }
            })
        }
    })
}

const makeCanOpenWindow = (elements) => {
    elements.forEach(element => {
        const windowId = element.dataset.windowId

        if (windowId) {
            addEventListeners(element, ['mouseup', 'touchend'], () => {
                if (!isDragging) {
                    createWindow(windowId)
                }
            })
        }
    })
}

const draggableElements = document.querySelectorAll('.draggable')
const resizableElements = document.querySelectorAll('.resizable')
const fullscreenElements = document.querySelectorAll('.fullscreen')
const linkElements = document.querySelectorAll('[data-href]')
const createWindowElements = document.querySelectorAll('[data-window-id]')

makeDraggable(draggableElements)
makeResizable(resizableElements)
makeFullscreen(fullscreenElements)
makeLink(linkElements)
makeCanOpenWindow(createWindowElements)
