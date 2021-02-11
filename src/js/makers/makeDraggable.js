const {
    applyStyles,
    addEventListeners,
    removeEventListeners,
    getPageCoords,
} = require('../utils')

const setBodyStyles = applyStyles(document.body)

const makeDraggable = (element) => {
    const dragTargets = element.querySelectorAll('.drag-target') || [element]

    const setDraggableStyles = applyStyles(element)

    if (element !== dragTargets[0]) {
        addEventListeners(element, ['mousedown', 'touchstart'], () => {
            setDraggableStyles({ zIndex: ++window.zIndex })
        })
    }

    dragTargets.forEach(dragTarget => {
        addEventListeners(dragTarget, ['mousedown', 'touchstart'], e => {
            if (!e.target.classList.contains('drag-target')) {
                return
            }

            const mouseClick = getPageCoords(e)

            setDraggableStyles({ zIndex: ++window.zIndex, userSelect: 'none' })
            setBodyStyles({ userSelect: 'none' })

            const styles = window.getComputedStyle(element, null)

            const left = parseInt(styles.getPropertyValue('left')) || 0
            const top = parseInt(styles.getPropertyValue('top')) || 0

            const handleMouseMove = e => {
                if (element.dataset.isFullscreen === 'true') {
                    element.dataset.isFullscreen = 'false'
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

                setDraggableStyles({ userSelect: 'auto' })
                setBodyStyles({ userSelect: 'auto' })

                window.isDragging = false
            }

            addEventListeners(document, ['mousemove', 'touchmove'], handleMouseMove)
            addEventListeners(document, ['mouseup', 'touchend'], handleMouseUp, { once: true })

            dragTarget.ondragstart = () => false
        })
    })
}

module.exports = makeDraggable
