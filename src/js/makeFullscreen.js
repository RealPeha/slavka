const {
    applyStyles,
    addEventListeners,
} = require('./utils')

const makeFullscreen = (element) => {
    const setFullscreenStyles = applyStyles(element)

    let clickCount = 0
    let rect = {}

    addEventListeners(element, ['mousedown'], () => {
        clickCount++

        if (clickCount >= 2) {
            setFullscreenStyles({ transition: 'left .1s, top .1s, width .1s, height .1s' })

            if (!element.dataset.isFullscreen || element.dataset.isFullscreen === 'false') {
                const { width, height } = element.getBoundingClientRect()

                rect = {
                    width,
                    height,
                    top: element.offsetTop,
                    left: element.offsetLeft,
                }

                element.dataset.isFullscreen = 'true'

                setFullscreenStyles({
                    width: '100%', height: '100%',
                    left: 0, top: 0,
                })
            } else {
                element.dataset.isFullscreen = 'false'

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
}

module.exports = makeFullscreen
