import React from 'react'
import { object } from 'prop-types'
import { BrushScatterMetricComponents as MetricComponents } from '../components/metrics/OldMetricComponent'
import { timeParse } from 'd3-time-format'
import mockData from './mockData.json'

import ReactResizeDetector from 'react-resize-detector';
import Draggable from 'react-draggable'

export class MetricContainers extends React.Component {
    state = { colour: true }    

    updateChart = () => {
        this.setState((prevState, props) => { colour: !prevState.colour })
    }    

    render() {
        // don't remove this otherwise update/re-rendering of component fails
        const data = JSON.parse(JSON.stringify(mockData))
                        .map(d => {
                            d.date = timeParse("%Y-%m-%dT%H:%M:%S.%LZ")(d.date);
                            d.price = +d.price;
                            return d;
                        })
                        .sort((a, b) => a.date - b.date)
        
        return (
            <div className="widget-scrollbar col-lg-6">
                <h1 onClick={this.updateChart}>
                    Metrics
                </h1>   
                <DraggableComponent
                    {...this.state}
                    data={data}
                />
            </div>
        )
    }
}

export class DraggableComponent extends React.Component {
    
    static defaultProps = {
        maxWidth: 2800
    }

    constructor(props) {
        super(props)

        this.state = { height: 400, width: 800 }

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

        return (
            <Draggable handle=".widget-handle-drag">
                <div ref={this.setDraggableRef}>
                    <ReactResizeDetector 
                        handleWidth 
                        handleHeight 
                        onResize={this.onResize}
                    />
                    <div className="widget-handle-drag"><span className="widget-drag"></span></div>

                    <MetricComponents 
                        {...this.state} 
                        colour={this.props.colour}
                        data={this.props.data}
                    />
                </div>
            </Draggable>
        )
    }
}

// export default MetricComponent
export default MetricContainers