const { safeJsonParse } = require('./utils')

const savePageState = () => {
    const elements = document.querySelectorAll('.draggable')

    const state = [...elements].map(element => {
        const style = element.style

        return {
            ...(style.zIndex && { zIndex: style.zIndex }),
            ...(style.top && { top: style.top }),
            ...(style.left && { left: style.left }),
            ...(style.width && { width: style.width }),
            ...(style.height && { height: style.height }),
            ...(element.dataset.inFullscreen && { fullscreen: element.dataset.inFullscreen }),
        }
    })

    localStorage.setItem('pageState', JSON.stringify(state))
    localStorage.setItem('openedWindows', JSON.stringify(openedWindows))
}

const restorePageState = () => {
    const state = safeJsonParse(localStorage.getItem('pageState'), null)

    return state
}

module.exports = {
    savePageState,
    restorePageState,
}
