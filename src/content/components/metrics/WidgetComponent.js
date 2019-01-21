import React from 'react'
import Draggable from 'react-draggable'
import { Panel, Well } from 'react-bootstrap';
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
            open: true,
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
            height: ((scrollHeight > 300) && (Math.abs(prevState.height - scrollHeight) > 170))
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

        
        return (
            <Draggable handle=".widget-handle-drag">
                <div ref={this.setDraggableRef}>
                    <ReactResizeDetector 
                        handleWidth 
                        handleHeight 
                        onResize={this.onResize}
                    />                    

                    <Panel defaultExpanded>
                        <Panel.Heading>
                            <Panel.Title>
                                <div className="widget-handle-drag">
                                    <span className="widget-drag"></span>
                                </div>
                            </Panel.Title>
                            <Panel.Toggle componentClass="a">Hide Widget</Panel.Toggle>
                        </Panel.Heading>
                        <Panel.Collapse>
                            <Panel.Body style={{ overflow: 'auto', }}>
                                <D3SVGComponent
                                    {...this.state} 
                                    colour={this.props.colour}
                                    data={this.props.data}
                                    dataMean={this.props.dataMean}
                                    widgetId={this.props.widgetId}
                                />
                            </Panel.Body>
                        </Panel.Collapse>
                    </Panel>

                    <div className="drag-tooltip">

                    </div>
                </div>
            </Draggable>
        )
    }
}
