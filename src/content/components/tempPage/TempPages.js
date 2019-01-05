import React from 'react'
import PropTypes from 'prop-types'
import { scaleLinear, scaleTime } from 'd3-scale'
import { max, sum, extent } from 'd3-array'
import { transition, delay } from 'd3-transition'
import { line } from 'd3-shape'
import { timeParse } from 'd3-time-format'
import { select, style } from 'd3-selection'
import { axisBottom, axisLeft } from 'd3-axis'
import dataJSON from './Data.json'

class TransitionLineChart extends React.Component {
    static propTypes = {
        margin: PropTypes.object,
        width: PropTypes.number,
        height: PropTypes.number,
        data: PropTypes.object
    }

    static defaultProps = {
        margin: { top: 20, right: 20, bottom: 30, left: 50 },
        width: 700,
        height: 400
    }

    constructor(props) {
        super(props)
        // this.createLineChart = this.createLineChart.bind(this)

        this.shouldUpdateSize = true;
        // minimal state to manage React lifecycle

        let data = JSON.parse(JSON.stringify(dataJSON))

        data.forEach(d => {
            d.date = timeParse("%Y-%m-%dT%H:%M:%S.%LZ")(d.date);
            d.close = +d.close;
        });

        this.data = data
        
        this.state = {
            initialized: false
        };
    }

    componentDidMount() {
        console.log('componentDidMount');
        this.init();
        // the code bellow is to trigger componentDidUpdate (which is not called at first render)
        setTimeout(() => {
            this.setState({
                initialized: true
            });
        });
    }

    componentWillReceiveProps({ margin, width, height, minX, maxX, maxY }) {
        console.log('componentWillReceiveProps');
        if (
            margin !== this.props.margin || 
            width !== this.props.width || 
            height !== this.props.height ||
            minX !== this.props.minX || 
            maxX !== this.props.maxX || 
            maxY !== this.props.maxY
        ) {
            console.log('change size');
            this.shouldUpdateSize = true;
        }
    }

    componentDidUpdate() {
        console.log('componentDidUpdate');
        this.update();
    }

    extractSize() {
        const { margin, width: widthIncludingMargins, height: heightIncludingMargins } = this.props;
        const width = widthIncludingMargins - margin.left - margin.right;
        const height = heightIncludingMargins - margin.top - margin.bottom;
        
        return { width, height, margin };
    }
    
    init() {
        console.log('init');
        this.lineGroup = this.rootNode.append('g');
        this.axisLeftGroup = this.lineGroup.append('g');
        this.axisBottomGroup = this.lineGroup.append('g');
    }
    
    updateSize() {
        console.log('updateSize');
        const { width, height, margin } = this.extractSize();

        // resize/re-align root nodes
        this.rootNode
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);

        this.lineGroup
            .attr('transform', `translate(${margin.left},${margin.top})`);

        let xScale = scaleTime()
                    .range([0, width])
                    .domain(extent(this.data, function (d) {
                        return d.date;
                    }));

        let yScale = scaleLinear()
                    .range([height, 0])
                        .domain([0, max(this.data, function (d) {
                            return d.close;
                        })]);

        // Update the X Axis
        this.axisBottomGroup.transition()
            .attr('transform', `translate(0,${height})`)
            .call(axisBottom(xScale).ticks(width > 500 ? Math.floor(width / 80) : 4)); // prevent from having too much ticks on small screens

        // Update the Y Axis
        this.axisLeftGroup.transition()
            .call(axisLeft(yScale));

        // this.line is not called directy since it's used as a callback and is re-assigned. It is wrapped inside this.line Reference
        this.line = line()
            .x(function (d) {
                return xScale(d.date);
            })
            .y(function (d) {
                return yScale(d.close);
            });
    }

    updateData() {
        console.log('updateData');

        const drawLine = this.line;

        // generate line paths
        const lines = this.lineGroup.selectAll('.line').data([this.data]);

        // [Update] transition from previous paths to new paths
        this.lineGroup.selectAll('.line')
            .attr('d', drawLine)
            .transition()
            .delay(2000)
            .style("stroke", this.props.colour ? "red" : "yellow");

        // [Enter] any new data
        lines.enter()
            .append('path')
            .attr('class', 'line')
            .attr('d', drawLine)
            .transition()
            .delay(2000)
            .style('stroke-width', '2px')
            .style('fill', 'none')
            .style("stroke", this.props.colour ? "red" : "yellow");

        // [Exit]
        lines.exit()
            .remove();
    }

    update() {
        console.log('update');
        // only call this.updateSize() if some props involving size have changed (check is done on componentWillReceiveProps)
        if (this.shouldUpdateSize === true) {
            this.updateSize();
            this.shouldUpdateSize = false;
        }
        this.updateData();
    }

    render() {
        return <svg className="line-graph" ref={node => this.rootNode = select(node)} width={700} height={400}></svg>
    }

}

class StaticLineChart extends React.Component {
    constructor(props) {
        super(props)
        this.createLineChart = this.createLineChart.bind(this)
    }

    componentWillUpdate() {
        select(this.rootNode).selectAll("*").remove();
    }

    createLineChart() {
        
        let data = JSON.parse(JSON.stringify(dataJSON))

        let margin = {top: 20, right: 20, bottom: 30, left: 50}, 
            width = 960 - margin.left - margin.right, 
            height = 500 - margin.top - margin.bottom

        let svg = select(this.rootNode)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        data.forEach(d => {
            d.date = timeParse("%Y-%m-%dT%H:%M:%S.%LZ")(d.date);
            d.close = +d.close;
        });

        let x = scaleTime()
                    .range([0, width])
                    .domain(extent(data, function (d) {
                        return d.date;
                    }));

        let y = scaleLinear()
                    .range([height, 0])
                        .domain([0, max(data, function (d) {
                            return d.close;
                        })]);

        let valueline = line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.close);
            });

        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline)
            .transition()
            .delay(2000)
            .style("stroke", this.props.colour ? "red": "yellow");

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(axisBottom(x));

        // Add the Y Axis
        svg.append("g")
            .call(axisLeft(y));
    }

    render() {
        if (this.rootNode) {
            this.createLineChart()
        } else {
            setTimeout(() => this.createLineChart(), 0);
        }
        
        return <svg className="line-graph" ref={node => this.rootNode = node} width={960} height={500}></svg>
    }

}

export class PageTemp extends React.Component {
    constructor(props) {
        super(props)
        this.updateChart = this.updateChart.bind(this)
        this.state = {
            colour: true
        }
    }

    updateChart() {
        this.setState({colour: false})
    }

    render() {
        return (
            <div>
                <h1 onClick={this.updateChart}>Temporary Page</h1>
                <StaticLineChart colour={this.state.colour} />
                <TransitionLineChart colour={this.state.colour}/>
            </div>    
        )
    }
}