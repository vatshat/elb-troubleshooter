import React from 'react'
import { object } from 'prop-types'
import { MetricComponent, MetricComponents } from '../components/metrics/MetricsComponent'
import { timeParse } from 'd3-time-format'
import mockData from './mockData.json'

class MetricContainer extends React.Component {
    static propTypes = {
        metricData: object.isRequired
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
    /* 
        fix bug caused - scatter plot getting misaligned
        https://bl.ocks.org/anqi-lu/5c793fb952dd9f9204abe6ebbd657461
    */
    windowResizeHandler = () => {
        this.setState({
            width: window.innerWidth < 900 ? window.innerWidth-100 : 800
        });
    }

    updateChart = () => {
        this.setState({colour: false})
    }

    render() {
        // substitute hard coded object key with period option from redux store
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
                // fix key prop by adding unique value to redux with crc32 hasing
                return <MetricComponent 
                    {...this.state}
                    data={ metricWidget }
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
        return <MetricComponent {...this.state} />
    }
}

export class MetricContainers extends React.Component {        
    state = {
        colour: true,
        height: 600,
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
        return (
            <div>
                <h1 onClick={this.updateChart}>
                    Metrics
                </h1>                                
                <MetricComponents 
                    {...this.state} 
                    data={JSON.parse(JSON.stringify(mockData))}
                />
            </div>    
        )
    }
}

// export default MetricComponent
export default MockStoreComponent(MetricContainer)