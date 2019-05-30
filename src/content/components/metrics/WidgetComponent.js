import React from 'react'
import Draggable from 'react-draggable'
import { array, string, number, oneOf } from 'prop-types'

import { Collapse, Fade, Tooltip, OverlayTrigger } from 'react-bootstrap';

import WidgetOptions from './WidgetOptions'


// Pure JS implementation instead of using Draggable libary - https://www.kirupa.com/html5/drag.htm

import D3SVGComponent from './D3SVGComponent'

// import ReactResizeDetector from 'react-resize-detector';

class WidgetComponent extends React.Component {
    constructor(props) {
        super(props)

        // figure what's going with initial width, why does it resize and mess up tooltip?

        this.state = {
            height: 400,
            width: 800,
            xMouse: 0,
            yMouse: 0,
            open: true,
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
        fetchMetricStatus: oneOf(['loading', 'error', 'success']).isRequired,
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
                        {
                            this.props.fetchMetricStatus == "success" ? <WidgetOptions { ...this.props } /> : null
                        }

                        <Fade in={open ? open : (!open)}>
                            <span
                                className={`glyphicon glyphicon-chevron-${ open ? "up" : "down"} col-sm-1`}
                                onClick = {
                                    () => this.setState((prevState, props) => ({
                                        open: !prevState.open
                                    }))
                                }
                            > </span>
                        </Fade>                        

                    </div>

                    <Collapse in={open}>
                        <div>
                            <D3SVGComponent
                                { ...this.state }
                                { ...this.props }
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

export default WidgetComponent;