const { applyStyles, addEventListeners } = require('../utils')

const makeFullscreen = (fullscreenElements) => fullscreenElements.forEach(fullscreenElement => {
    const setFullscreenStyles = applyStyles(fullscreenElement)

    let clickCount = 0
    let rect = {}

    addEventListeners(fullscreenElement, ['mousedown'], () => {
        clickCount++

        if (clickCount >= 2) {
            setFullscreenStyles({ transition: 'left .1s, top .1s, width .1s, height .1s' })

            if (!fullscreenElement.dataset.isFullscreen || fullscreenElement.dataset.isFullscreen === 'false') {
                const { width, height } = fullscreenElement.getBoundingClientRect()

                rect = {
                    width,
                    height,
                    top: fullscreenElement.offsetTop,
                    left: fullscreenElement.offsetLeft,
                }

                fullscreenElement.dataset.isFullscreen = 'true'

                setFullscreenStyles({
                    width: '100%', height: '100%',
                    left: 0, top: 0,
                })
            } else {
                fullscreenElement.dataset.isFullscreen = 'false'

                setFullscreenStyles({
                    width: `${rect.width}px`,
                    height: `${rect.height}px`,
                    left: `${rect.left}px`,
                    top: `${rect.top}px`,
                })
            }

            setTimeout(() => setFullscreenStyles({ transition: 'none' }), 100)
        }

        setTimeout(() => clickCount = 0, 200)
    })
})

module.exports = makeFullscreen
