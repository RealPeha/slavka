const { addEventListeners } = require('../utils')

const makeOpenWindow = (element) => {
    const windowId = element.dataset.windowId

    if (windowId) {
        addEventListeners(element, ['mouseup', 'touchend'], () => {
            if (!window.isDragging) {
                window.windowsManager.open(windowId)
            }
        })
    }
}

module.exports = makeOpenWindow
