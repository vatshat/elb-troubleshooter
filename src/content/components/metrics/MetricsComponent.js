import React from 'react'
import PropTypes from 'prop-types'
import { scaleLinear, scaleTime } from 'd3-scale'
import { transition, delay } from 'd3-transition'
import { line } from 'd3-shape'
import { select, style } from 'd3-selection'
import { axisBottom, axisLeft } from 'd3-axis'

export class MetricComponent extends React.Component {
    static propTypes = {
        margin: PropTypes.object,
        width: PropTypes.number,
        height: PropTypes.number,
        data: PropTypes.array.isRequired
    }

    static defaultProps = {
        margin: { top: 20, right: 20, bottom: 30, left: 50 },
        width: 1000,
        height: 600
    }

    constructor(props) {
        super(props)
        
        this.shouldUpdateSize = true;
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
            this.shouldUpdateSize = true;
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
    
    updateSize() {
        const { width, height, margin } = this.extractSize();

        // resize/re-align root nodes
        this.rootNode
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);

        this.lineGroup
            .attr('transform', `translate(${margin.left},${margin.top})`);

        let xScale = scaleTime()
                        .range([0, width])
                        .domain(this.props.xDomain);

        let yScale = scaleLinear()
                        .range([height, 0])
                        .domain([0, this.props.yDomain]);

        // Update the X Axis
        this.axisBottomGroup.transition()
            .attr('transform', `translate(0,${height})`)
            .call(
                width < 500 
                    ? axisBottom(xScale).ticks(4) 
                    : axisBottom(xScale)
            ); // prevent from having too much ticks on small screens

        // Update the Y Axis
        this.axisLeftGroup.transition()
            .attr('fill', 'white')
            .call(axisLeft(yScale));

        // this.line is not called directy since it's used as a callback and is re-assigned. It is wrapped inside this.line Reference
        this.line = line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.value));
    }

    updateData() {

        const drawLine = this.line;
        
        // generate line paths
        const lines = this.lineGroup.selectAll('.line').data([this.props.data]);

        // [Update] transition from previous paths to new paths
        this.lineGroup.selectAll('.line')
            .transition()
            .delay(1000)
            .style("stroke", this.props.colour ? "red" : "yellow")
            .attr('d', drawLine)

        // [Enter] any new data
        lines.enter()
            .insert('path', "g")
            .attr('class', 'line')
            .transition()
            .delay(1000)
            .attr('d', drawLine)
                .style('stroke-width', '2px')
                .style('fill', 'none')
                .style("stroke", this.props.colour ? "red" : "yellow");

        // [Exit]
        lines.exit()
            .remove();
    }

    update() {
        // only call this.updateSize() if some props involving size have changed (check is done on componentWillReceiveProps)
        if (this.shouldUpdateSize === true) {
            this.updateSize();
            this.shouldUpdateSize = false;
        }
        this.updateData();
    }

    render() {
        let { width, height } = this.props

        return <svg className="line-graph" ref={node => this.rootNode = select(node)} width={width} height={height}></svg>
    }

}