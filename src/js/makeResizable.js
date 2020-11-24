const {
    applyStyles,
    addEventListeners,
    removeEventListeners,
    getPageCoords,
    createDiv,
} = require('./utils')

const createResizer = (type, parent) => {
    const resizer = createDiv(parent, [
        'resizer',
        ...(Array.isArray(type) ? type : type.split(' ')),
    ])

    return resizer
}

const createResizers = (types, container) => {
    return types.map(type => createResizer(type, container))
}

const isLargeScreen = window.innerWidth > 744

const makeResizable = (element) => {
    const setResizableStyles = applyStyles(element)

    const resizersContainer = createDiv(element)

    const resizers = createResizers(
        ['top', 'right', 'bottom', 'left', 'top left', 'top right', 'bottom left', 'bottom right'],
        resizersContainer
    )

    resizers.forEach(resizer => {
        addEventListeners(resizer, ['mousedown', 'touchstart'], (e) => {
            const mouseClick = getPageCoords(e)
            const rect = element.getBoundingClientRect()
            const offset = {
                top: element.offsetTop,
                left: element.offsetLeft,
            }

            const resizeTop = (e) => {
                const { pageY } = getPageCoords(e)
    
                setResizableStyles({ height: rect.height + (mouseClick.pageY - pageY) + 'px' })
    
                if (!isLargeScreen) {
                    setResizableStyles({ top: offset.top + (pageY - mouseClick.pageY) + 'px' })
                } else {
                    setResizableStyles({ top: pageY + 'px' })
                }
            }
    
            const resizeRight = (e) => {
                const { pageX } = getPageCoords(e)
    
                setResizableStyles({ width: pageX - rect.left + 'px' })
            }
    
            const resizeBottom = (e) => {
                const { pageY } = getPageCoords(e)
    
                setResizableStyles({ height: pageY - rect.top + 'px' })
            }
    
            const resizeLeft = (e) => {
                const { pageX } = getPageCoords(e)
    
                setResizableStyles({
                    width: rect.width + (mouseClick.pageX - pageX) + 'px',
                    left: pageX + 'px',
                })
            }

            const classes = resizer.classList

            const resize = (e) => {
                if (element.dataset.isFullscreen === 'true') {
                    element.dataset.isFullscreen = 'false'
                }

                classes.contains('top') && resizeTop(e)
                classes.contains('right') && resizeRight(e)
                classes.contains('bottom') && resizeBottom(e)
                classes.contains('left') && resizeLeft(e)
            }

            const stopResize = () => {
                removeEventListeners(window, ['mousemove', 'touchmove'], resize)
            }

            addEventListeners(window, ['mousemove', 'touchmove'], resize)
            addEventListeners(window, ['mouseup', 'touchend'], stopResize)
        })
    })
}

module.exports = makeResizable
