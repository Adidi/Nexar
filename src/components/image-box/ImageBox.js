import React, {useRef, useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import ldMap from 'lodash/map'
import cx from 'classnames'
import Annotation from '../anotation'
import {getElementCoordinate} from '../../util/dom'
import './ImageBox.scss'

const ImageBox = ({
    imageSrc,
    annotations,
    updatePosition,
    addAnnotation,
    imgDimensions,
    annotationWidth,
    annotationHeight,
    editMode,
    removeAnnotation,
}) => {
    const imageBoxRef = useRef(null)
    const [moving, setMoving] = useState(false)
    const [shift, setShift] = useState({})

    useEffect(() => {
        document.addEventListener('mouseup', stopMoving)

        return () => {
            document.removeEventListener('mouseup', stopMoving)
        }
    }, [])

    const startMoving = (id, shiftX, shiftY) => {
        // the moving holds the id of the current moving annotation
        setMoving(id)
        setShift({x: shiftX, y: shiftY})
    }

    const stopMoving = () => {
        setMoving(false)
    }

    const onMouseMove = e => {
        if (moving) {
            const {x, y} = getElementCoordinate(e, imageBoxRef.current)
            updatePosition(moving, x - shift.x, y - shift.y)
        }
    }

    return (
        <div className={cx('wrapper', {'edit-mode': editMode})}>
            <div
                className="image-box"
                ref={imageBoxRef}
                onMouseMove={onMouseMove}
                onClick={addAnnotation}
                style={{
                    width: imgDimensions.width,
                    height: imgDimensions.height,
                    backgroundImage: `url("${imageSrc}")`,
                }}
            >
                {ldMap(annotations, annotation => {
                    return (
                        <Annotation
                            key={annotation.id}
                            width={annotationWidth}
                            height={annotationHeight}
                            startMoving={startMoving}
                            stopMoving={stopMoving}
                            data={annotation}
                            removeAnnotation={removeAnnotation}
                        />
                    )
                })}
            </div>
        </div>
    )
}

ImageBox.propTypes = {
    imageSrc: PropTypes.string.isRequired,
    imgDimensions: PropTypes.object.isRequired,
    annotationWidth: PropTypes.number.isRequired,
    annotationHeight: PropTypes.number.isRequired,
    editMode: PropTypes.bool.isRequired,
    updatePosition: PropTypes.func.isRequired,
    addAnnotation: PropTypes.func.isRequired,
    removeAnnotation: PropTypes.func.isRequired,
}

export default ImageBox
