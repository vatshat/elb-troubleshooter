import React from 'react'
import { object, number, array, any } from 'prop-types'
import DraggableWidgetComponent from '../components/metrics/WidgetComponent'

// d3 imports
import { csv } from 'd3-fetch'
import { timeParse } from 'd3-time-format'

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
                            <DraggableWidgetComponent 
                                {...this.state}
                                data = { metricWidget["metricData"] }
                                dataMean = { metricWidget["metricData"].reduce((total, dataPoint) => total + dataPoint["Values"]) / metricWidget.length }
                                widgetId={ metricWidget["id"] } 
                                key= { metricWidget["id"] }
                            />
                        </div>
            })

        return (
            <div>
                <h1 onClick={this.updateChart}>
                    Metrics
                </h1>
                
                {metricWidgets}
                
            </div>    
        )
    }
}

const HOCMockStoreComponent = MockStoreComponent => class extends React.Component {    

    state = {
        metricData: {
            "MetricDataResults": [{
                "StatusCode": "Incomplete",
                "Id": (() => (
                    Math
                    .random()
                    .toString(36)
                    .substring(2, 15) +
                    Math.random().toString(36).substring(2, 15)
                ))(),
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
                return {
                    id: metricDataPeriod["Id"],
                    metricData: metricDataPeriod["Timestamps"]
                                    .slice(0, 250)
                                    .map((timestamp, index) => {
                                        return {
                                            date: timeParse("%Y-%m-%dT%H:%M:%SZ")(timestamp),
                                            value: +metricDataPeriod["Values"][index] // convert string to number
                                        }
                                    })
                                    .sort((a, b) => a.date - b.date)
                }
            })

        return <MockStoreComponent metricData = { metricWidgets } />
    }
}

/* 
    export default HOCMockStoreComponent (substitute with Redux connect)

        HOCMockStoreComponent --> Data into --> MockStoreComponent --> DraggableComponent --> MetricComponent


 */
export default HOCMockStoreComponent(MetricContainer)