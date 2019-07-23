import React from 'react'
import PropTypes from 'prop-types'
import shortid from 'shortid'
import ldMap from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import ImageBox from './components/image-box'
import Loader from './components/loader'
import {getElementCoordinate} from './util/dom'
import './app.scss'

class App extends React.Component {
    static propTypes = {
        imageSrc: PropTypes.string.isRequired,
        annotationWidth: PropTypes.number.isRequired,
        annotationHeight: PropTypes.number.isRequired,
    }

    constructor(props) {
        super(props)
        this.state = {
            annotations: {},
            editMode: false,
            imgDimensions: {},
            output: '',
        }
    }

    componentDidMount() {
        const {imageSrc} = this.props
        //getting image size to work with background image
        const img = new Image()
        img.onload = () => {
            this.setState({
                imgDimensions: {
                    width: img.width,
                    height: img.height,
                },
            })
        }

        img.src = imageSrc
    }

    onClickNew = e => {
        this.setState({
            mode: 'edit',
        })
    }

    updatePosition = (id, x, y) => {
        this.setState(state => {
            const {annotations} = state
            const oldAnnotation = annotations[id]
            const newAnnotation = {
                ...oldAnnotation,
                x,
                y,
            }

            return {
                annotations: {
                    ...annotations,
                    [id]: newAnnotation,
                },
            }
        })
    }

    addAnnotation = e => {
        const {editMode} = this.state
        if (!editMode) {
            return
        }

        const {x, y} = getElementCoordinate(e)

        const id = shortid.generate()

        this.setState(state => {
            return {
                annotations: {
                    ...state.annotations,
                    [id]: {
                        id,
                        x,
                        y,
                    },
                },
            }
        })
    }

    removeAnnotation = id => e => {
        this.setState(state => {
            const {annotations} = state
            const {[id]: annotation, ...rest} = annotations
            return {
                annotations: rest,
            }
        })
    }

    onClickNewOff = e => {
        this.setState(state => ({
            output: '',
            annotations: {},
            editMode: !state.editMode,
        }))
    }

    onClickSend = e => {
        const {annotations} = this.state
        const {annotationWidth, annotationHeight} = this.props
        const outputData = ldMap(annotations, a => ({
            x: a.x,
            y: a.y,
            annotationWidth,
            annotationHeight,
        }))
        this.setState({
            annotations: {},
            editMode: false,
            output: JSON.stringify(outputData, null, 2),
        })
    }

    render() {
        const {annotations, imgDimensions, editMode, output} = this.state
        const {imageSrc, annotationWidth, annotationHeight} = this.props

        const showContent = !isEmpty(imgDimensions)
        const disabledSend = !editMode || isEmpty(annotations)
        return (
            <div className="nexar">
                <div className="dashboard">
                    <div className="container">
                        {showContent ? (
                            <>
                                <ImageBox
                                    imgDimensions={imgDimensions}
                                    addAnnotation={this.addAnnotation}
                                    updatePosition={this.updatePosition}
                                    annotations={annotations}
                                    imageSrc={imageSrc}
                                    annotationWidth={annotationWidth}
                                    annotationHeight={annotationHeight}
                                    editMode={editMode}
                                    removeAnnotation={this.removeAnnotation}
                                />
                                <div className="actions">
                                    <button onClick={this.onClickNewOff}>
                                        {editMode ? 'Off' : 'New'}
                                    </button>
                                    <button
                                        disabled={disabledSend}
                                        onClick={this.onClickSend}
                                    >
                                        Send
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="loader-box">
                                <div>Loading...</div>
                                <Loader />
                            </div>
                        )}
                    </div>
                    <div className="output">
                        <pre>{output}</pre>
                    </div>
                </div>
            </div>
        )
    }
}

export default App
