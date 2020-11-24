class WindowsManager {
    constructor() {
        this.windows = new Map()
    }

    register(id, window) {
        this.windows.set(id, window)
    }
}

module.exports = WindowsManager
