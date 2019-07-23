import React from 'react'
import PropTypes from 'prop-types'
import './Annotation.scss'

const Annotation = ({
    data,
    startMoving,
    stopMoving,
    width,
    height,
    removeAnnotation,
}) => {
    const onMouseDown = e => {
        const boundingRect = e.target.getBoundingClientRect()
        const shiftX = e.clientX - boundingRect.left
        const shiftY = e.clientY - boundingRect.top
        startMoving(data.id, shiftX, shiftY)
    }

    return (
        <div
            onMouseDown={onMouseDown}
            onMouseUp={stopMoving}
            onClick={e => e.stopPropagation()}
            className="annotation"
            style={{
                top: data.y,
                left: data.x,
                width,
                height,
            }}
        >
            <div className="x" onClick={removeAnnotation(data.id)}>
                X
            </div>
        </div>
    )
}

Annotation.propTypes = {
    data: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    startMoving: PropTypes.func.isRequired,
    stopMoving: PropTypes.func.isRequired,
    removeAnnotation: PropTypes.func.isRequired,
}

export default Annotation
