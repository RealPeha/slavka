const { addEventListeners } = require('./utils')
const windowsManager = require('./windowsManager')

const makeOpenWindow = (element) => {
    const windowId = element.dataset.windowId

    if (windowId) {
        addEventListeners(element, ['mouseup', 'touchend'], () => {
            if (!window.isDragging) {
                windowsManager.open(windowId)
            }
        })
    }
}

module.exports = makeOpenWindow
