const { applyStyles } = require('../utils')

const makeCentered = (elements) => elements.forEach(element => {
    const setStyles = applyStyles(element)

    if (window.isLargeScreen) {
        setStyles({
            top: 'calc((100% - 70%) / 2)',
            left: 'calc((100% - 70%) / 2)',
        })
    } else {
        setStyles({
            top: 'calc((100% - 70%) / 2)',
            left: 'calc((100% - 90%) / 2)',
            width: '90%',
        })
    }
})

module.exports = makeCentered
