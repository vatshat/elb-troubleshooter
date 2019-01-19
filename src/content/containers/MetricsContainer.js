import React from 'react'
import { object, number, array, any } from 'prop-types'
import MetricComponent from '../components/metrics/MetricComponent'

// d3 imports
import { csv } from 'd3-fetch'
import { timeParse } from 'd3-time-format'

import ReactResizeDetector from 'react-resize-detector';
import Draggable from 'react-draggable'

class MetricContainer extends React.Component {
    static propTypes = { metricData: array.isRequired }
    
    state = { colour: true }
    
    updateChart = () => {
        this.setState((prevState, props) => { colour: !prevState.colour })
    }

    render() {
        const metricWidgets =  this.props.metricData
            .map((metricWidget, widgetIndex) => {
                return <div className="widget-scrollbar col-lg-6">
                            <DraggableComponent 
                                {...this.state}
                                data = { metricWidget }
                                dataMean = { metricWidget.reduce((total, dataPoint) => total + dataPoint["Values"]) / metricWidget.length }
                                widgetIndex={widgetIndex}
                            />
                        </div>
            })

        return (
            <div className="col-lg-12">
                <h1 onClick={this.updateChart}>
                    Metrics
                </h1>
                
                {metricWidgets}
                
            </div>    
        )
    }
}

class DraggableComponent extends React.Component {
    
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

                    <MetricComponent
                        {...this.state} 
                        colour={this.props.colour}
                        data={this.props.data}
                        dataMean = {this.props.dataMean}
                        key = {this.props.widgetIndex}
                    />
                </div>
            </Draggable>
        )
    }
}

const MockStoreComponent = MetricComponent => class extends React.Component {    

    state = {
        metricData: {
            "MetricDataResults": [{
                "StatusCode": "Incomplete",
                "Id": "m1",
                "Timestamps": ["1970-01-01T00:00:00Z"],
                "Label": "Metric",
                "Values": [1]
            }]
        }
    }

    componentDidMount() {
        fetch('http://localhost:8080/api/5min')
            .then(promise => promise.json())
            .then(response => {
                this.setState({
                    metricData: response
                })
            });
    }

    render() {   

        const metricWidgets = this.state.metricData["MetricDataResults"]
            .map((metricDataPeriod) => {
                return metricDataPeriod["Timestamps"]
                        .slice(0, 250)
                        .map((timestamp, index) => {
                            return {
                                date: timeParse("%Y-%m-%dT%H:%M:%SZ")(timestamp),
                                value: +metricDataPeriod["Values"][index] // convert string to number
                            }
                        })
                        .sort((a, b) => a.date - b.date)
            })

        return <MetricComponent metricData = { metricWidgets } />
    }
}

// export default MetricComponent (substitute with Redux connect)
export default MockStoreComponent(MetricContainer)