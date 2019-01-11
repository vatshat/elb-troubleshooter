import React from 'react'
import { object, number, array, any } from 'prop-types'
import mockData from './mockData.json'
import { line } from 'd3-shape'
import { brushX } from 'd3-brush'
import { max, extent } from 'd3-array'
import { csv } from 'd3-fetch'
import { timeParse } from 'd3-time-format'
import { axisBottom, axisLeft } from 'd3-axis'
import { scaleLinear, scaleTime } from 'd3-scale'
import { transition, delay } from 'd3-transition'
import { select, style, event } from 'd3-selection'

export class MetricComponent extends React.Component {
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
            
            const drawLine = line()
                .x(d => xScale(d.date))
                .y(d => yScale(d.value));

            // generate line paths
            const lines = this.lineGroup.selectAll('.line').data([data]);
            
            // [Update] transition from previous paths to new paths
            this.lineGroup.selectAll('.line')
                .transition()
                .delay(500)
                .style("stroke", colour ? "yellow" : "red")
                .attr('d', drawLine)

            // [Enter] any new data
            lines.enter()
                .insert('path', "g")
                    .attr('class', 'line')
                    .transition()
                    .delay(500)
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

export class MetricComponents extends React.Component {
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
        let actualHeight = 500,
            margin = {top: 20, right: 20, bottom: 110, left: 50},
            margin2 = {top: actualHeight-70, right: 20, bottom: 30, left: 40},
            width = 800 - margin.left - margin.right,
            height = actualHeight - margin.top - margin.bottom,
            height2 = actualHeight - margin2.top - margin2.bottom;
            
        return { margin, margin2, width, height, height2 }
    }

    init() {
        this.defsElement = this.rootNode.append('defs');
        this.contextGroup = this.rootNode.append('g');
        this.focusGroup = this.rootNode.append('g');
    }
        
    update() {
        if (this.shouldUpdate) {
            let parseDate = timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
            
            const { margin, margin2, width, height, height2 } = this.extractSize()

            let x = scaleTime().range([0, width]),
                x2 = scaleTime().range([0, width]),
                y = scaleLinear().range([height, 0]),
                y2 = scaleLinear().range([height2, 0]);

            let xAxis = axisBottom(x),
                xAxis2 = axisBottom(x2),
                yAxis = axisLeft(y);

            this.defsElement
                .append("clipPath")
                    .attr("id", "clip")
                    .append("rect")
                    .attr("width", width)
                    .attr("height", height);

            let focus = this.focusGroup
                        .attr("class", "focus")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            let context = this.contextGroup
                            .attr("class", "context")
                            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

            let brushed = () => {
                let selection = event.selection;
                x.domain(selection.map(x2.invert, x2));
                focus.selectAll(".dot")
                    .attr("cx", d => x(d.date))
                    .attr("cy", d => y(d.price));
                focus.select(".axis--x").call(xAxis);
            }

            let data = JSON.parse(JSON.stringify(mockData))

            data = data.map(d => {
                            d.date = parseDate(d.date);
                            d.price = +d.price;
                            return d;
                        }) 

            let brush = brushX()
                .extent([[0, 0], [width, height2]])
                .on("brush", brushed);

                
            x.domain(extent(data, d =>  d.date));
            y.domain([0, max(data, d => d.price)+200]);
            x2.domain(x.domain());
            y2.domain(y.domain());
        
            // append scatter plot to main chart area 
            let dots = focus.append("g");
                dots.attr("clip-path", "url(#clip)");
                dots.selectAll("dot")
                    .data(data)
                    .enter().append("circle")
                    .attr('class', 'dot')
                    .attr("r",5)
                    .style("opacity", .5)
                    .attr("cx", function(d) { return x(d.date); })
                    .attr("cy", function(d) { return y(d.price); })
                    
            focus.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            focus.append("g")
                .attr("class", "axis axis--y")
                .call(yAxis);

            focus.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Price");

            this.rootNode.append('text')
                .attr("transform",
                    "translate(" + ((width + margin.right + margin.left) / 2) + " ," +
                    (height + margin.top + margin.bottom) + ")")
                .style("text-anchor", "middle")
                .text("Date");

            // append scatter plot to brush chart area      
            var dots = context.append("g");
            dots.attr("clip-path", "url(#clip)");
            dots.selectAll("dot")
                .data(data)
                .enter().append("circle")
                .attr('class', 'dotContext')
                .attr("r", 3)
                .style("opacity", .5)
                .attr("cx", function (d) {
                    return x2(d.date);
                })
                .attr("cy", function (d) {
                    return y2(d.price);
                })

            context.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height2 + ")")
                .call(xAxis2);

            context.append("g")
                .attr("class", "brush")
                .call(brush)
                .call(brush.move, x.range());
        }
    }

    render() {        
        
        const { margin, width, height } = this.extractSize()

        return <svg className="root-svg" 
                    ref={ node => this.rootNode = select(node) }
                    width = { width + margin.left + margin.right }
                    height = { height + margin.top + margin.bottom } 
                >

                </svg>
    }

} 

export default MetricComponents