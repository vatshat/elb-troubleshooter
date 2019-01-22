import React from 'react'
import Draggable from 'react-draggable'
import { Panel, Well, Collapse, Fade, Tooltip, 
            OverlayTrigger, Checkbox, FormGroup, ControlLabel } from 'react-bootstrap';
import ReactResizeDetector from 'react-resize-detector';
import D3SVGComponent from './D3SVGComponent'

export default class DraggableWidgetComponent extends React.Component {
    
    static defaultProps = {
        maxWidth: 2800
    }

    constructor(props) {
        super(props)

        this.state = { 
            height: 400, 
            width: 800,
            open: true
        }

        this.draggableRef = null

        this.setDraggableRef = element => {
            this.draggableRef = element
        }
    }
    
    componentDidMount() {
        document.getElementById("footer-filler").style.zIndex = "-1";
    }

    onResize = () => {
        // console.log(this.draggableRef.scrollWidth)
        let { scrollHeight, scrollWidth } = this.draggableRef        

        this.setState((prevState, props) => ({
            height: ((scrollHeight > 300) && (Math.abs(prevState.height - scrollHeight) > 50))
                    ? scrollHeight - 100 
                    : prevState.height,
            width: ((width) => {
                                    if (width < 300) {
                                        return 300
                                    } else if (width > this.props.maxWidth) {
                                        return this.props.maxWidth
                                    } else return width - 100

                                })
                    (scrollWidth)
        }));
    }
    
    
    render() {        
        
        let { open } = this.state

        const tooltip = (
            <Tooltip id="tooltip">
                Bug :( Just click and drog to resize widget...the cursor does not automatically change to arrows. 
            </Tooltip>
        );

        return (
            <Draggable handle=".widget-handle-drag">
                <div ref={this.setDraggableRef}>
                    <ReactResizeDetector 
                        handleWidth 
                        handleHeight 
                        onResize={this.onResize}
                    />                    
                    
                    <div className="widget-handle-drag">

                        <span className="widget-drag"></span>
                        
                        {
                            open ?
                                <Fade in={open}>
                                    <span 
                                        className={`glyphicon glyphicon-chevron-up`} 
                                        onClick = {
                                            () => this.setState({
                                                open: !this.state.open
                                            })
                                        }
                                    > </span>
                                </Fade>
                                :
                                <Fade in={!open}>
                                    <span 
                                        className={`glyphicon glyphicon-chevron-down`} 
                                        onClick = {
                                            () => this.setState({
                                                open: !this.state.open
                                            })
                                        }
                                    > </span>
                                </Fade>
                        }                        
                        
                        <form className={"col-sm-6"}>
                            <FormGroup>
                                <ControlLabel>Widget Options:</ControlLabel>{' '}
                                <Checkbox inline>Prediction</Checkbox> 
                                <Checkbox inline>Drawline</Checkbox>
                                <Checkbox inline>Multi-AZ</Checkbox>
                            </FormGroup>
                        </form>
                    </div>

                    <Collapse in={open}>
                        <div>
                            <D3SVGComponent
                                {...this.state} 
                                colour={this.props.colour}
                                data={this.props.data}
                                dataMean={this.props.dataMean}
                                widgetId={this.props.widgetId}
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
