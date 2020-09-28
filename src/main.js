const draggableElements = document.querySelectorAll('.draggable')
const resizableElements = document.querySelectorAll('.resizable')
const fullscreenElements = document.querySelectorAll('.fullscreen')
const linkElements = document.querySelectorAll('[data-href]')

let zIndex = 1
let isDrag = false
let isBigger = window.innerWidth > 744

const addEventListeners = (element, events, handler, options = {}) => {
    events.forEach(event => element.addEventListener(event, handler, options))
}

const removeEventListeners = (element, events, handler) => {
    events.forEach(event => element.removeEventListener(event, handler))
}

const getPageCoord = (e) => {
    if (e.changedTouches) {
        return {
            pageX: e.changedTouches[0].pageX,
            pageY: e.changedTouches[0].pageY,
        }
    }

    return {
        pageX: e.pageX,
        pageY: e.pageY,
    }
}

const makeDraggable = (draggableElements) => {
    draggableElements.forEach(draggableElement => {
        const dragTargets = draggableElement.querySelectorAll('.drag-target') || [draggableElement]
        
        dragTargets.forEach(dragTarget => {
            addEventListeners(dragTarget, ['mousedown', 'touchstart'], e => {
                if (!e.target.classList.contains('drag-target')) {
                    return
                }
    
                const {
                    pageX: clickX,
                    pageY: clickY,
                } = getPageCoord(e)

                document.body.style.userSelect = 'none'
    
                draggableElement.style.zIndex = ++zIndex

                const styles = window.getComputedStyle(draggableElement, null)

                const left = parseInt(styles.getPropertyValue('left')) || 0
                const top = parseInt(styles.getPropertyValue('top')) || 0
    
                const handleMouseMove = e => {
                    isDrag = true
                    
                    const { pageX, pageY } = getPageCoord(e)

                    draggableElement.style.left = left + pageX - clickX + 'px'
                    draggableElement.style.top = top + pageY - clickY + 'px'
                }

                const handleMouseUp = () => {
                    removeEventListeners(document, ['mousemove', 'touchmove'], handleMouseMove)
                    isDrag = false
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
            const { pageY } = getPageCoord(e)

            resizableElement.style.height = rect.height + (mouseClick.pageY - pageY) + 'px'

            if (!isBigger) {
                resizableElement.style.top = offset.top + (pageY - mouseClick.pageY) + 'px'
            } else {
                resizableElement.style.top = pageY + 'px'
            }
        }

        const resizeRight = (e) => {
            const { pageX } = getPageCoord(e)

            resizableElement.style.width = pageX - rect.left + 'px'
        }

        const resizeBottom = (e) => {
            const { pageY } = getPageCoord(e)

            resizableElement.style.height = pageY - rect.top + 'px'
        }

        const resizeLeft = (e) => {
            const { pageX } = getPageCoord(e)

            resizableElement.style.width = rect.width + (mouseClick.pageX - pageX) + 'px'
            resizableElement.style.left = pageX + 'px'
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
                mouseClick = getPageCoord(e)
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
    fullscreenElements.forEach(fullscreenElement => {
        let clickCount = 0
        let isFullscreen = false
        let rect = {}

        addEventListeners(fullscreenElement, ['mousedown'], () => {
            clickCount++
            
            if (clickCount >= 2) {                
                fullscreenElement.style.transition = 'left .1s, top .1s, width .1s, height .1s'
            
                if (!isFullscreen) {
                    const { width, height } = fullscreenElement.getBoundingClientRect()

                    rect = {
                        width,
                        height,
                        top: fullscreenElement.offsetTop,
                        left: fullscreenElement.offsetLeft,
                    }

                    isFullscreen = true
                    fullscreenElement.style.width = '100%'
                    fullscreenElement.style.height = '100%'
                    fullscreenElement.style.left = '0'
                    fullscreenElement.style.top = '0'
                } else {
                    isFullscreen = false
                    fullscreenElement.style.width = rect.width + 'px'
                    fullscreenElement.style.height = rect.height + 'px'
                    fullscreenElement.style.left = rect.left + 'px'
                    fullscreenElement.style.top = rect.top + 'px'
                }

                setTimeout(() => fullscreenElement.style.transition = 'none', 100)
            }

            setTimeout(() => clickCount = 0, 200)
        })
    })
}

const makeLink = (linkElements) => {
    linkElements.forEach(linkElement => {
        const href = linkElement.dataset.href

        addEventListeners(linkElement, ['mouseup', 'touchend'], () => {
            if (!isDrag) {
                window.location.href = href
            }
        })
    })
}

makeDraggable(draggableElements)
makeResizable(resizableElements)
makeFullscreen(fullscreenElements)
makeLink(linkElements)

fullscreenElements.forEach(fullscreenElement => {
    if (isBigger) {
        fullscreenElement.style.top = 'calc((100% - 70%) / 2)'
        fullscreenElement.style.left = 'calc((100% - 70%) / 2)'
        fullscreenElement.style.width = `${fullscreenElement.getBoundingClientRect().width}px`
    } else {
        fullscreenElement.style.top = 'calc((100% - 70%) / 2)'
        fullscreenElement.style.left = 'calc((100% - 90%) / 2)'
        fullscreenElement.style.width = `90%`
        fullscreenElement.style.margin = '0'
    }
})
