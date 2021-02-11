const { addEventListeners } = require('../utils')

const makeOpenLink = (linkElements) => linkElements.forEach(linkElement => {
    const href = linkElement.dataset.href

    if (href) {
        addEventListeners(linkElement, ['mouseup', 'touchend'], () => {
            if (!window.isDragging) {
                window.location.href = href
            }
        })
    }
})

module.exports = makeOpenLink
