import React from 'react'
import { object, number, array, any } from 'prop-types'
import MetricComponent from '../components/metrics/MetricComponent'

// d3 imports
import { csv } from 'd3-fetch'
import { timeParse } from 'd3-time-format'

class MetricContainer extends React.Component {
    static propTypes = { metricData: array.isRequired }
    
    state = {
        colour: true,
        height: 400,
        width: window.innerWidth < 900 ? window.innerWidth-100 : 800
    }

    componentDidMount() {
        window.addEventListener("resize", this.windowResizeHandler);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.windowResizeHandler);
    }        
    
    // scatterplot respond to resize https://bl.ocks.org/anqi-lu/5c793fb952dd9f9204abe6ebbd657461

    windowResizeHandler = () => {
        this.setState({
            width: window.innerWidth < 900 ? window.innerWidth-100 : 800
        });
    }

    updateChart = () => {
        this.setState({colour: false})
    }

    render() {
        const metricWidgets =  this.props.metricData
            .map((metricWidget, widgetIndex) => {
                return <MetricComponent 
                    {...this.state}
                    data = { metricWidget }
                    dataMean = {
                        metricWidget.reduce((total, dataPoint) => total + dataPoint["Values"]) / metricWidget.length
                    }
                    key={widgetIndex}
                />
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