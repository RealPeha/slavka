const { safeJsonParse, $$, applyStyles } = require('./utils')

class PageState {
    static restoreOpenedWindows() {
        const openedWindows = safeJsonParse(localStorage.getItem('openedWindows'), [])

        return Array.isArray(openedWindows) ? openedWindows : []
    }

    static restoreState() {
        const state = safeJsonParse(localStorage.getItem('pageState'), null)

        if (state) {
            window.zIndex = Math.max(...state.map(({ zIndex }) => parseInt(zIndex)).filter(Boolean))
        
            const elements = $$('.draggable')
        
            elements.forEach((element, i) => {
                const elementState = state[i]
        
                if (elementState) {
                    applyStyles(element)(elementState)

                    if (elementState.fullscreen) {
                        element.dataset.isFullscreen = elementState.fullscreen
                    }
                }
            })
        }
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
                ...(element.dataset.isFullscreen && { fullscreen: element.dataset.isFullscreen }),
            }
        })

        localStorage.setItem('pageState', JSON.stringify(state))
        localStorage.setItem('openedWindows', JSON.stringify(window.openedWindows))
    }
}

module.exports = PageState
