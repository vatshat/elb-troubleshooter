import React from 'react'
import PropTypes from 'prop-types'
import { MetricComponent } from '../components/metrics/MetricsComponent'
import { max, extent } from 'd3-array'
import { timeParse } from 'd3-time-format'

class MetricContainer extends React.Component {
    static propTypes = {
        metricData: PropTypes.object.isRequired
    }
    
    static defaultProps = {
        metricData: {
                "MetricDataResults": [{
                    "StatusCode": "Complete",
                    "Id": "m1",
                    "Timestamps": [],
                    "Label": "Metric",
                    "Values": []
                }]
            }
    }
    
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

    windowResizeHandler = () => {
        this.setState({
            width: window.innerWidth < 900 ? window.innerWidth-100 : 800
        });
    }

    updateChart = () => {
        this.setState({colour: false})
    }

    render() {
        // substitute hard coded key with period option from redux store
        const metricWidgets = this.props.metricData["MetricDataResults"]
            .map((metricDataPeriod) => {            
                // fix up slice with time interval from redux store
                return metricDataPeriod["Timestamps"]
                        .slice(0, 300)
                        .map((timestamp, index) => {
                            return {
                                date: timeParse("%Y-%m-%dT%H:%M:%SZ")(timestamp),
                                value: +metricDataPeriod["Values"][index] // convert string to number
                            }
                        })
            })
            .map((metricWidget, widgetIndex) => {
                return <MetricComponent 
                    {...this.state}
                    data={ metricWidget }
                    xDomain={ extent(metricWidget, d => d.date) }
                    yDomain={ max(metricWidget, d => d.value) }
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

let MockStoreComponent = MetricComponent => class extends React.Component {    
    componentDidMount() {
        fetch('http://localhost:8080/api/1min')
            .then(promise => promise.json())
            .then(response => {
                this.setState({
                    metricData: response
                })
            });
    }

    render() {        
        // return ( 
        //     // investigate further why data is not transitioning?
        //     this.state.metricDataFetched 
        //         ?  
        //         : <div>Loading or Error</div> 
        // )

        return <MetricComponent {...this.state} />
    }
}

// export default MetricComponent
export default MockStoreComponent(MetricContainer)