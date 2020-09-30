(() => {
    const windowsContainer = document.querySelector('.content-wrapper')
    const openedWindows = []
    const windows = [
        {
            id: 'mine',
            title: 'Minecraft',
            items: [
                {
                    type: 'folder',
                    title: 'Бесплатные моды для майнкрафта',
                    windowId: 'test',
                },
                {
                    type: 'file',
                    title: 'Лучшая в мире игра',
                    href: '/mine',
                },
            ],
            itemsSort: (a, b) => a.type < b.type, // folder first
        },
        {
            id: 'toe',
            title: 'Wantid',
            content: `
                <h1>Да</h1>
                <p>Согласен</p>
            `.trim(),
            styles: {
                width: 'auto',
                height: 'auto',
            },
            features: {
                resizable: false,
                fullscreen: false,
                title: false,
                // draggable: true,
            }
        },
    ]

    let zIndex = 1
    let isDragging = false
    let isLargeScreen = window.innerWidth > 744

    const addEventListeners = (element, events, handler, options = {}) => {
        events.forEach(event => element.addEventListener(event, handler, options))
    }

    const removeEventListeners = (element, events, handler) => {
        events.forEach(event => element.removeEventListener(event, handler))
    }

    const getPageCoords = ({ changedTouches, pageX, pageY }) => {
        if (changedTouches) {
            const [{ pageX, pageY }] = changedTouches

            return { pageX, pageY }
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

    const createWindow = (id) => {
        if (openedWindows.includes(id)) {
            return
        }

        const defaultFeatures = {
            resizable: true,
            draggable: true,
            fullscreen: true,
            title: true,
        }

        openedWindows.push(id)

        const windowData = windows.find(window => window.id === id) || { title: '404', content: 'Not Found' }

        const {
            title = '',
            content = '',
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

        contentDiv.innerHTML = content

        if (items && items.length) {
            const itemsWrapper = createDiv(contentDiv, ['items-wrapper'])

            if (itemsSort) {
                items.sort(itemsSort)
            }

            items.forEach(item => {
                const createdItem = createItem(itemsWrapper, item)

                if (item.href) {
                    makeClickable([createdItem])
                } else if (item.windowId) {
                    makeOpenable([createdItem])
                }
            })
        }

        windowFeatures.draggable && makeDraggable([windowWrapper])
        windowFeatures.resizable && makeResizable([windowWrapper])
        windowFeatures.fullscreen && makeFullscreen([windowWrapper])
        makeCentered([windowWrapper])

        const applyWindowStyles = applyStyles(windowWrapper)

        applyWindowStyles({
            ...(styles || {}),
            zIndex: ++zIndex,
            opacity: 1,
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

    const applyStyles = (element) => (styles = {}) => {
        Object.entries(styles).forEach(([property, value]) => {
            element.style[property] = value.toString()
        })
    }

    const setBodyStyles = applyStyles(document.body)

    const makeDraggable = (draggableElements) => draggableElements.forEach(draggableElement => {
        const dragTargets = draggableElement.querySelectorAll('.drag-target') || [draggableElement]
        const setDraggableStyles = applyStyles(draggableElement)

        if (draggableElement !== dragTargets[0]) {
            addEventListeners(draggableElement, ['mousedown', 'touchstart'], () => {
                setDraggableStyles({ zIndex: ++zIndex })
            })
        }
        
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

    const makeResizable = (resizableElements) => resizableElements.forEach(resizableElement => {
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

    const makeFullscreen = (fullscreenElements) => fullscreenElements.forEach(fullscreenElement => {
        const setFullscreenStyles = applyStyles(fullscreenElement)

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

    const makeClickable = (linkElements) => linkElements.forEach(linkElement => {
        const href = linkElement.dataset.href

        if (href) {
            addEventListeners(linkElement, ['mouseup', 'touchend'], () => {
                if (!isDragging) {
                    window.location.href = href
                }
            })
        }
    })

    const makeOpenable = (elements) => elements.forEach(element => {
        const windowId = element.dataset.windowId

        if (windowId) {
            addEventListeners(element, ['mouseup', 'touchend'], () => {
                if (!isDragging) {
                    createWindow(windowId)
                }
            })
        }
    })

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
    makeClickable(document.querySelectorAll('[data-href]'))
    makeOpenable(document.querySelectorAll('[data-window-id]'))
})()