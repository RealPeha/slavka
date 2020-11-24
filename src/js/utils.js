const addEventListeners = (element, events, handler, options = {}) => {
    events.forEach(event => element.addEventListener(event, handler, options))
}

const removeEventListeners = (element, events, handler) => {
    events.forEach(event => element.removeEventListener(event, handler))
}

const getPageCoords = ({ changedTouches, pageX, pageY }) => {
    if (changedTouches) {
        const [{ pageX, pageY }] = changedTouches

        return { pageX, pageY }
    }

    return { pageX, pageY }
}

const createDiv = (parent, classList) => {
    const div = document.createElement('div')

    if (classList) {
        div.classList.add(...classList)
    }

    parent.appendChild(div)

    return div
}

const applyStyles = (element) => (styles = {}) => {
    Object.entries(styles).forEach(([property, value]) => {
        element.style[property] = value.toString()
    })
}

const safeJsonParse = (text, fallback = {}) => {
    try {
        return JSON.parse(text)
    } catch (e) {
        return fallback
    }
}

const $ = selector => document.querySelector(selector)
const $$ = selector => document.querySelectorAll(selector)

module.exports = {
    addEventListeners,
    removeEventListeners,
    getPageCoords,
    createDiv,
    applyStyles,
    safeJsonParse,
    $,
    $$,
}
