const { applyStyles, isLargeScreen } = require('../utils')

const makeCentered = (element) => {
    const setStyles = applyStyles(element)

    if (isLargeScreen()) {
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
}

module.exports = makeCentered
