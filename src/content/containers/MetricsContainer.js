import React from 'react'
import { object } from 'prop-types'
import { MetricComponents } from '../components/metrics/MetricsComponent'
import { timeParse } from 'd3-time-format'
import mockData from './mockData.json'

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

                    // don't remove this otherwise update/re-rendering of component fails
                    data={JSON.parse(JSON.stringify(mockData))}
                />
            </div>    
        )
    }
}

// export default MetricComponent
export default MetricContainers