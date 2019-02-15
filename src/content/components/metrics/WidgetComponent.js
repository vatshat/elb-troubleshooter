import React from 'react'
import Draggable from 'react-draggable'
import { object, array, string, number } from 'prop-types'

// Pure JS implementation instead of using Draggable libary - https://www.kirupa.com/html5/drag.htm

import D3SVGComponent from './D3SVGComponent'
import { Panel, Well, Collapse, Fade, Tooltip,
            OverlayTrigger, Checkbox, FormGroup, ControlLabel } from 'react-bootstrap';
// import ReactResizeDetector from 'react-resize-detector';

export default class WidgetComponent extends React.Component {
    constructor(props) {
        super(props)

        // figure what's going with initial width, why does it resize and mess up tooltip?

        this.state = {
            height: 400,
            width: 800,
            xMouse: 0,
            yMouse: 0,
            open: true,
            drawLine: true,
        }

        this.draggableRef = null

        this.setDraggableRef = element => {
            this.draggableRef = element
        }
    }

    static propTypes = {
        errorMessage: string,
        data: array.isRequired,
        dataMean: number.isRequired,
        status: string.isRequired,
    }

    componentDidMount() {
        document.getElementById("footer-filler").style.zIndex = "-1";
    }

    onResizeHandler = () => {

        let { scrollHeight, scrollWidth } = this.draggableRef;

        if (
            (Math.abs(this.state.xMouse - scrollWidth) < 10) &&
            (Math.abs(this.state.yMouse - scrollHeight) < 10)
        ) {
            this.setState({
                height: scrollHeight - 100,
                width: scrollWidth - 100,
            })
        }
    }

    // https://nerdparadise.com/programming/javascriptmouseposition
    // https://www.kirupa.com/html5/get_element_position_using_javascript.htm

    onMouseMoveHandler = mouseEvent => {
        let obj = this.draggableRef,
            obj_left = 0,
            obj_top = 0;

        while (obj.offsetParent) {
            obj_left += obj.offsetLeft;
            obj_top += obj.offsetTop;
            obj = obj.offsetParent;
        }

        let xpos = mouseEvent.pageX - obj_left,
            ypos = mouseEvent.pageY - obj_top;

        this.setState({
            xMouse: xpos,
            yMouse: ypos,
        });
    }

    onChangeHandler = eventChecked => { this.setState({ drawLine: eventChecked.target.checked }) }

    render() {

        let { open } = this.state

        const tooltip = (
            <Tooltip id="bug-tool-tip">
                <div>
                    <span>
                        Bug :( 
                    </span>
                    <p></p>
                    <p>
                        -- The cursor does not automatically change to arrows when hovering over corner handle.
                    </p>
                    <p>
                        -- The widget doesn{"'"}t resize properly when changing size to quickly                
                    </p>
                </div>
            </Tooltip>
        );

        return (
            <Draggable
                defaultClassName="draggable-widget"
                handle=".widget-handle-drag"
            >
                <div
                    onMouseMove = {this.onMouseMoveHandler}
                    ref = {this.setDraggableRef}
                >
                    {
                        /* <ReactResizeDetector
                            handleWidth
                            handleHeight
                            onResize={this.onResizeHandler}
                        /> */
                    }

                    <div className={"widget-handle-drag"}>

                        <span className={"widget-drag"}></span>

                        {
                            open ?
                                <Fade in={open}>
                                    <span
                                        className={`glyphicon glyphicon-chevron-up`}
                                        onClick = {
                                            () => this.setState((prevState, props) => {
                                                open: !prevState.open
                                            })
                                        }
                                    > </span>
                                </Fade>
                                :
                                <Fade in={!open}>
                                    <span
                                        className={`glyphicon glyphicon-chevron-down`}
                                        onClick = {
                                            () => this.setState((prevState, props) => {
                                                open: !prevState.open
                                            })
                                        }
                                    > </span>
                                </Fade>
                        }

                        <form className={"col-sm-6"}>
                            <FormGroup>
                                <ControlLabel>Widget Options:</ControlLabel>{' '}
                                <Checkbox inline>Prediction</Checkbox>
                                <Checkbox 
                                    inline
                                    defaultChecked={true}
                                    onChange={this.onChangeHandler}
                                >
                                    Draw Line
                                </Checkbox>
                                <Checkbox inline>Multi-AZ</Checkbox>
                            </FormGroup>
                        </form>
                    </div>

                    <Collapse in={open}>
                        <div>
                            <D3SVGComponent
                                {...this.state}
                                {...this.props}
                            />
                        </div>
                    </Collapse>

                    <div className="drag-tooltip">
                        <OverlayTrigger placement="left" overlay={tooltip}>
                            <span className={"glyphicon glyphicon-question-sign"}></span>
                        </OverlayTrigger>
                    </div>
                </div>
            </Draggable>
        )
    }
}
