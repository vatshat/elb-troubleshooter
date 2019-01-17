import React from 'react'
import { object } from 'prop-types'
import { BrushScatterMetricComponents as MetricComponents } from '../components/metrics/OldMetricComponent'
import { timeParse } from 'd3-time-format'
import mockData from './mockData.json'

export class MetricContainers extends React.Component {        
    state = {
        colour: true,
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
        // don't remove this otherwise update/re-rendering of component fails
        const data = JSON.parse(JSON.stringify(mockData))
                        .map(d => {
                            d.date = timeParse("%Y-%m-%dT%H:%M:%S.%LZ")(d.date);
                            d.price = +d.price;
                            return d;
                        })
                        .sort((a, b) => a.date - b.date)

        return (
            <div>
                <h1 onClick={this.updateChart}>
                    Metrics
                </h1>                                
                <MetricComponents 
                    {...this.state} 

                    data={data}
                />
            </div>    
        )
    }
}

// export default MetricComponent
export default MetricContainers