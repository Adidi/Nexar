/**
 * get coordinate of element relative to its parent
 * @param {*} event
 * @param {*} el
 */
export const getElementCoordinate = (event, el) => {
    el = el || event.target
    const bounds = el.getBoundingClientRect()
    return {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
    }
}
