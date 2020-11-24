const { addEventListeners } = require('./utils')

const makeOpenWindow = (elements) => {
    elements.forEach(element => {
        const windowId = element.dataset.windowId

        if (windowId) {
            addEventListeners(element, ['mouseup', 'touchend'], () => {
                if (!window.isDragging) {
                    createWindow(windowId)
                }
            })
        }
    })
}

module.exports = makeOpenWindow
