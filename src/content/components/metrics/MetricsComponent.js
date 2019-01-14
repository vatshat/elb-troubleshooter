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

export class MetricComponents extends React.Component {
    
    static propTypes = {
        data: array.isRequired,
    }

    static defaultProps = {
        margin: { top: 20, right: 20, bottom: 110, left: 50 },
        margin2: { top: 600 - 70, right: 20, bottom: 30, left: 50 },
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
        const { height: actualHeight, width: actualWidth, margin, margin2 } = this.props

        let width = actualWidth - margin.left - margin.right,
            height = actualHeight - margin.top - margin.bottom,
            height2 = actualHeight - margin2.top - margin2.bottom;
            
        return { margin, margin2, width, height, height2 }
    }

    init() {
        
        const { margin, margin2, width, height, height2 } = this.extractSize()

        this.defs = this.rootNode.append('defs')
            .append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", width)
                .attr("height", height);

        /* 
            http://javascriptissexy.com/12-simple-yet-powerful-javascript-tips/

            https://blog.mariusschulz.com/2016/01/19/use-cases-for-javascripts-iifes

            IIFE = closures, function/block scoping, aliasing, minification 

         */

        // initialize context G
        {
            
            this.focusGroup = this.rootNode.append('g')
                                            .attr("class", "focus")
                                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            this.focusDots = this.focusGroup.append("g");            

            this.focusXAxis = this.focusGroup.append("g")
                                .attr("class", "axis axis--x")
                                .attr("transform", "translate(0," + height + ")")

            this.focusYAxis = this.focusGroup.append("g")
                                .attr("class", "axis axis--y")

            this.focusYText = this.focusGroup.append("text")
                                .attr("transform", "rotate(-90)")
                                .attr("y", 0 - margin.left)
                                .attr("x", 0 - (height / 2))
                                .attr("dy", "1em")
                                .style("text-anchor", "middle")
                                .text("Price");

            this.xText = this.rootNode.append('text')
                                    .attr("transform",
                                        "translate(" + ((width + margin.right + margin.left) / 2) + " ," +
                                        (height + margin.top + margin.bottom) + ")")
                                    .style("text-anchor", "middle")
                                    .text("Date");

        }
        
        // initialize focus G

        let context = (() => {
            this.contextGroup = this.rootNode.append('g')
                .attr("class", "context")
                .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
    
            this.contextDots = this.contextGroup.append("g");

            this.contextXAxis = this.contextGroup.append("g")
                                                .attr("class", "axis axis--x")
                                                .attr("transform", "translate(0," + height2 + ")");
    
            this.contextBrush = this.contextGroup.append("g")
                                                .attr("class", "brush");
        })()        
    }    

    update() {
        if (this.shouldUpdate) {
            let parseDate = timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
            
            const { margin, width, height, height2, margin2 } = this.extractSize()
            const { data, colour } = this.props
            
            let x = scaleTime().range([0, width]),
                x2 = scaleTime().range([0, width]),
                y = scaleLinear().range([height, 0]),
                y2 = scaleLinear().range([height2, 0]);

            let xAxis = axisBottom(x),
                xAxis2 = axisBottom(x2),
                yAxis = axisLeft(y);

            const drawFocusLine = line()
                .x(d => x(d.date))
                .y(d => y(d.price));

            const brushed = () => {
                let selection = event.selection;
                x.domain(selection.map(x2.invert, x2));
                this.focusGroup.selectAll(".dot")
                    .attr("cx", d => x(d.date))
                    .attr("cy", d => y(d.price));
                this.focusGroup.select(".axis--x").call(xAxis);

                this.focusGroup.selectAll(".line")
                    .attr("d", drawFocusLine);
            }

            data.map(d => {
                            d.date = parseDate(d.date);
                            d.price = +d.price;
                            return d;
                        }) 

            let brush = brushX()
                .extent([[0, 0], [width, height2]])
                .on("brush", brushed);

            this.defs 
                .attr("width", width)
                .attr("height", height);
                
            x.domain(extent(data, d =>  d.date));
            y.domain([0, max(data, d => d.price)+200]);
            x2.domain(x.domain());
            y2.domain(y.domain());
        
            /*     
                scatterplot 
                    http://bl.ocks.org/WilliamQLiu/bd12f73d0b79d70bfbae
                    https://stackoverflow.com/questions/38065997/d3-js-attribute-setting-not-working-after-binding-data-and-entering-elements

            */

            // append scatter plot to main chart area 
            
            this.focusDots.attr("clip-path", "url(#clip)");
            let focusDots = this.focusDots.selectAll(".dot").data(data)

            focusDots
                .enter().append("circle") // new/entering dots/data
                    .attr('class', 'dot')
                    .attr("r",1)
                    .style("opacity", .5)
                    .attr('fill-opacity', 0.6)
                    .style("fill", colour ? "red" : "yellow")
                    .attr("cx", d =>  x(d.date))
                    .attr("cy", d => y(d.price))
                
            focusDots.exit().remove()

            this.focusXAxis
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            this.focusYAxis.call(yAxis);

            this.focusYText
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height / 2))

            this.xText
                .attr("transform",
                    "translate(" + ((width + margin.right + margin.left) / 2) + " ," +
                    (height + margin.top + margin.bottom) + ")")

            this.contextGroup
                .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

            
            // append line graph to brush chart area

            let focusLineUpdate = this.focusDots.selectAll(".line").data([data])
            
            // [Update] transition from previous paths to new paths
            this.focusDots.selectAll('.line')
                .style("stroke", colour ? "rgb(36, 48, 64)" : "red")
                .attr('d', drawFocusLine)

            // [Enter] any new data
            focusLineUpdate.enter()
                .insert('path', 'circle')
                .attr('class', 'line')
                .attr('d', drawFocusLine)
                    .style('stroke-width', '2px')
                    .style('fill', 'none')
                    .style("stroke", colour ? "rgb(36, 48, 64)" : "red");

            // [Exit]
            focusLineUpdate.exit()
                .remove();

            // append scatter plot to brush chart area

            this.contextDots.attr("clip-path", "url(#clip)");
            
            let contextDots = this.contextDots.selectAll(".dot").data(data)

            contextDots
                .enter()
                    .append("circle")
                    .attr('class', 'dot')
                .merge(contextDots)
                    .attr("r", 1)
                    .style("opacity", .5)
                    .attr('fill-opacity', 0.6)
                    .style("fill", colour ? "red" : "yellow")
                    .attr("cx", d => x2(d.date))
                    .attr("cy", d => y2(d.price))

            this.contextXAxis
                .attr("transform", "translate(0," + height2 + ")")
                .call(xAxis2);

            this.contextBrush
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