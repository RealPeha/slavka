const PageState = require('./PageState')
const Window = require('./window')

class WindowsManager {
    constructor() {
        this.windows = new Map()
        this.openedWindows = new Set(PageState.restoreOpenedWindows())

        this.openedWindows.forEach(id => {
            this.open(id, true)
        })
    }

    register(id, window) {
        this.windows.set(id, window)
    }

    open(id, ignoreOpened = false) {
        if (this.openedWindows.has(id) && !ignoreOpened) {
            return
        }
    
        if (!ignoreOpened) {
            this.openedWindows.add(id)
        }
    
        const window = this.windows.get(id) || new Window().title('404').content('Not Found')

        window.render()
    }

    close(id) {
        const window = this.windows.get(id)

        if (window) {
            window.close()

            this.openedWindows.delete(id)
        }
    }
}

module.exports = new WindowsManager()
