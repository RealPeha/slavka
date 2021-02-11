const { applyStyles, addEventListeners, removeEventListeners, getPageCoords } = require('../utils')

const createResizer = (type, parent) => {
    const resizer = document.createElement('div')
    resizer.classList.add('resizer', ...(Array.isArray(type) ? type : type.split(' ')))
    parent.appendChild(resizer)

    return resizer
}

const createResizers = (types, container) => {
    return types.map(type => createResizer(type, container))
}

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

        if (!window.isLargeScreen) {
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
            if (resizableElement.dataset.isFullscreen === 'true') {
                resizableElement.dataset.isFullscreen = 'false'
            }

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

module.exports = makeResizable
