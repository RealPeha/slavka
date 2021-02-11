const { applyStyles, addEventListeners, removeEventListeners, getPageCoords } = require('../utils')

const setBodyStyles = applyStyles(document.body)

const makeDraggable = (draggableElements) => draggableElements.forEach(draggableElement => {
    const dragTargets = draggableElement.querySelectorAll('.drag-target') || [draggableElement]
    const setDraggableStyles = applyStyles(draggableElement)

    if (draggableElement !== dragTargets[0]) {
        addEventListeners(draggableElement, ['mousedown', 'touchstart'], () => {
            setDraggableStyles({ zIndex: ++window.zIndex })
        })
    }

    dragTargets.forEach(dragTarget => {
        addEventListeners(dragTarget, ['mousedown', 'touchstart'], e => {
            if (!e.target.classList.contains('drag-target')) {
                return
            }

            const mouseClick = getPageCoords(e)

            setBodyStyles({ userSelect: 'none' })
            setDraggableStyles({ zIndex: ++window.zIndex })

            const styles = window.getComputedStyle(draggableElement, null)

            const left = parseInt(styles.getPropertyValue('left')) || 0
            const top = parseInt(styles.getPropertyValue('top')) || 0

            const handleMouseMove = e => {
                if (draggableElement.dataset.isFullscreen === 'true') {
                    draggableElement.dataset.isFullscreen = 'false'
                }

                window.isDragging = true

                const { pageX, pageY } = getPageCoords(e)

                setDraggableStyles({
                    left: left + pageX - mouseClick.pageX + 'px',
                    top: top + pageY - mouseClick.pageY + 'px',
                })
            }

            const handleMouseUp = () => {
                removeEventListeners(document, ['mousemove', 'touchmove'], handleMouseMove)
                setBodyStyles({ userSelect: 'auto' })

                window.isDragging = false
            }

            addEventListeners(document, ['mousemove', 'touchmove'], handleMouseMove)
            addEventListeners(document, ['mouseup', 'touchend'], handleMouseUp, { once: true })

            dragTarget.ondragstart = () => false
        })
    })
})

module.exports = makeDraggable
