import React from 'react'
import PropTypes from 'prop-types'
import {getElementCoordinate} from '../../util/dom'
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
        const {x, y} = getElementCoordinate(e)
        startMoving(data.id, x, y)
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
