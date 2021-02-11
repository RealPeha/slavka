const { safeJsonParse, $$ } = require('./utils')

class PageState {
    static restoreOpenedWindows() {
        const openedWindows = safeJsonParse(localStorage.getItem('openedWindows'), [])

        return Array.isArray(openedWindows) ? openedWindows : []
    }

    static restoreState() {
        const state = safeJsonParse(localStorage.getItem('pageState'), null)

        return state
    }

    static save() {
        const elements = $$('.draggable')

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
        localStorage.setItem('openedWindows', JSON.stringify(window.windowManager.openedWindows))
    }
}

module.exports = PageState
