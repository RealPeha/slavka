const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

const getPageCoords = ({ changedTouches, pageX, pageY }) => {
    if (changedTouches) {
        const [{ pageX, pageY }] = changedTouches

        return { pageX, pageY }
    }

    return { pageX, pageY }
}

const addEventListeners = (element, events, handler, options = {}) => {
    events.forEach(event => element.addEventListener(event, handler, options))
}

const removeEventListeners = (element, events, handler) => {
    events.forEach(event => element.removeEventListener(event, handler))
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

const safeJsonParse = (json, fallback = {}) => {
    try {
        return JSON.parse(json)
    } catch (e) {
        return fallback
    }
}

module.exports = {
    $,
    $$,
    getPageCoords,
    addEventListeners,
    removeEventListeners,
    createDiv,
    applyStyles,
    safeJsonParse,
}
