const { addEventListeners } = require('./utils')

const makeOpenLink = (elements) => {
    return elements.forEach(element => {
        const href = element.dataset.href

        if (href) {
            addEventListeners(element, ['mouseup', 'touchend'], () => {
                if (!window.isDragging) {
                    window.location.href = href
                }
            })
        }
    })
}

module.exports = makeOpenLink
