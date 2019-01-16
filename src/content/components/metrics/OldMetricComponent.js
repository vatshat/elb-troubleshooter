import React from 'react'
import { object, number, array, any } from 'prop-types'
import { line } from 'd3-shape'
import { brushX } from 'd3-brush'
import { max, extent } from 'd3-array'
import { csv } from 'd3-fetch'
import { timeParse } from 'd3-time-format'
import { axisBottom, axisLeft } from 'd3-axis'
import { scaleLinear, scaleTime } from 'd3-scale'
import { transition, delay } from 'd3-transition'
import { select, style, event } from 'd3-selection'

class MetricComponent extends React.Component {
    static propTypes = {
        margin: object,
        width: number,
        height: number,
        data: array.isRequired,
    }

    static defaultProps = {
        margin: { top: 20, right: 20, bottom: 30, left: 50 },
        width: 800,
        height: 600
    }

    constructor(props) {
        super(props)
        
        this.shouldUpdate = true;
        // minimal state to manage React lifecycle

        this.state = {
            initialized: false
        };
    }

    componentDidMount() {
        this.init();
        // the code below is to trigger componentDidUpdate (which is not called at first render)
        setTimeout(() => {
            this.setState({
                initialized: true
            });
        });
    }

    componentDidUpdate({ margin, width, height, xDomain, yDomain }) {
        if (
            margin !== this.props.margin || 
            width !== this.props.width || 
            height !== this.props.height ||
            xDomain !== this.props.xDomain ||
            yDomain !== this.props.yDomain
        ) {
            this.shouldUpdate = true;
        }
        this.update();
    }
    
    extractSize() {
        const { margin, width: widthIncludingMargins, height: heightIncludingMargins } = this.props;
        const width = widthIncludingMargins - margin.left - margin.right;
        const height = heightIncludingMargins - margin.top - margin.bottom;
        
        return { width, height, margin };
    }
    
    init() {
        this.lineGroup = this.rootNode.append('g');
        this.axisLeftGroup = this.lineGroup.append('g');
        this.axisBottomGroup = this.lineGroup.append('g');
    }
    
    update() {
        if (this.shouldUpdate) {
            const { width, height, margin } = this.extractSize();

            const { data, colour } = this.props
                    
            // resize/re-align root nodes
            this.rootNode
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom);

            this.lineGroup
                .attr('transform', `translate(${margin.left},${margin.top})`);

            let xScale = scaleTime()
                            .range([0, width])
                            .domain(extent(data, d => d.date));

            let yScale = scaleLinear()
                            .range([height, 0])
                            .domain([0, max(data, d => d.value)]);

            // Update the X Axis
            this.axisBottomGroup
                .attr('transform', `translate(0,${height})`)
                .call(
                    width < 500 
                        ? axisBottom(xScale).ticks(4) 
                        : axisBottom(xScale)
                ); // prevent from having too much ticks on small screens

            // Update the Y Axis
            this.axisLeftGroup
                .attr('fill', 'white')
                .call(axisLeft(yScale));
            
            const drawLine = line()
                .x(d => xScale(d.date))
                .y(d => yScale(d.value));

            // generate line paths
            const lines = this.lineGroup.selectAll('.line').data([data]);
            
            // [Update] transition from previous paths to new paths
            this.lineGroup.selectAll('.line')
                .transition()
                .delay(100)
                .style("stroke", colour ? "yellow" : "red")
                .attr('d', drawLine)

            // [Enter] any new data
            lines.enter()
                .insert('path', "g")
                    .attr('class', 'line')
                    .transition()
                    .delay(100)
                    .attr('d', drawLine)
                        .style('stroke-width', '2px')
                        .style('fill', 'none')
                        .style("stroke", colour ? "yellow" : "red");

            // [Exit]
            lines.exit()
                .remove();

            // plots data join
            let dots = this.lineGroup.selectAll('.dot').data(data)

            /*     
                scatterplot 
                    http://bl.ocks.org/WilliamQLiu/bd12f73d0b79d70bfbae
                    https://stackoverflow.com/questions/38065997/d3-js-attribute-setting-not-working-after-binding-data-and-entering-elements

            */

            dots.exit().remove()

            // [Enter] circles        
            dots
                .enter()
                    .insert("circle", "g")
                    .attr('class', 'dot')
                .merge(dots) // [Update] circles
                    .attr("cx", d => xScale(d.date))
                    .attr("cy", d => yScale(d.value))
                    .style("fill", colour ? "red" : "yellow")
                    .attr("r", 1)
        }
    }

    render() {
        let { width, height } = this.props
        
        return <svg className="line-graph" 
                    ref={node => this.rootNode = select(node)} 
                    width={width} 
                    height={height}>                    
                </svg>
    }

}

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

// export default MetricComponent
export default MockStoreComponent(MetricContainer)