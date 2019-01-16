import React from 'react'
import { object, number, array, any } from 'prop-types'
import { line } from 'd3-shape'
import { brushX } from 'd3-brush'
import { max, extent, bisector } from 'd3-array'
import { csv } from 'd3-fetch'
import { timeParse } from 'd3-time-format'
import { axisBottom, axisLeft } from 'd3-axis'
import { scaleLinear, scaleTime } from 'd3-scale'
import { transition, delay } from 'd3-transition'
import { select, style, event, mouse } from 'd3-selection'

const blueColour = "rgb(36, 48, 64)"
const orangeColour = "rgb(203, 75, 22)"

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

    updateAxis() {
        const { margin, margin2, width, height, height2 } = this.extractSize()

        // axis update
        let xScale = scaleTime().range([0, width]),
            xScale2 = scaleTime().range([0, width]),
            yScale = scaleLinear().range([height, 0]),
            yScale2 = scaleLinear().range([height2, 0]),
            xAxis = axisBottom(xScale),
            xAxis2 = axisBottom(xScale2),
            yAxis = axisLeft(yScale);

        return { xScale, xScale2, yScale, yScale2, xAxis, xAxis2, yAxis }
    }

    initFocus() {
        
        const { margin, width, height } = this.extractSize()
        const { data } = this.props
        const { xScale, yScale } = this.updateAxis()

        this.brushRect = this.rootNode.append('defs')
            .append("clipPath")
                .attr("id", "clip")
                .append("rect")
                    .attr("width", width)
                    .attr("height", height);

        this.focusGroup = this.rootNode.append('g')
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        this.focusWidget = this.focusGroup.append("g");
        

            {
                const bisectDate = bisector(d => d.date).left;
                
                let mousemove = () => { 
                    let x0 = xScale.invert(mouse(this.focusRect._groups[0][0])[0]),
                        i = bisectDate(data, x0, 1), 
                        d0 = data[i - 1], 
                        d1 = data[i], 
                        d = x0 - d0.date > d1.date - x0 ? d1 : d0;

                    let temp1 = xScale(d.date),
                        temp2 = yScale(d.price)
                        
                    this.focusToolTip
                        .attr("transform",
                            "translate(" + temp1 + "," +
                            temp2 + ")");
                }

                this.focusToolTip = this.focusGroup
                                        .append("g") 
                                            .style("display", "none")
                this.focusToolTip
                    .append("circle") 
                        .attr("class", "tooltip y") 
                        .style("fill", "none") 
                        .style("stroke", "blue") 
                        .attr("r", 4);
                                        
                this.focusRect = this.focusGroup
                                    .append("rect")
                                        .attr("id", "rectToolTip")
                                        .attr("width", width)
                                        .attr("height", height)
                                        .style("fill", "none")
                                        .style("pointer-events", "all")
                                        .on("mouseover", () => this.focusToolTip.style("display", null))
                                        .on("mouseout", () => this.focusToolTip.style("display", "none"))
                                        .on("mousemove", mousemove);   
            }

       
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
            .style("fill", orangeColour)
            .text("Price");

        this.xText = this.rootNode.append('text')
            .attr("transform",
                "translate(" + ((width + margin.right + margin.left) / 2) + " ," +
                (height + margin.top + margin.bottom) + ")")
            .style("text-anchor", "middle")
            .style("fill", orangeColour)
            .text("Date");
    }

    initContext() {
        
        const { margin2, height2 } = this.extractSize()

        this.contextGroup = this.rootNode.append('g')
            .attr("class", "context")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

        this.contextDots = this.contextGroup.append("g");

        this.contextXAxis = this.contextGroup.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height2 + ")");

        this.contextBrush = this.contextGroup.append("g")
            .attr("class", "brush");
    }

    init() {
        
        this.props.data
            .map(d => {
                        d.date = timeParse("%Y-%m-%dT%H:%M:%S.%LZ")(d.date);
                        d.price = +d.price;
                        return d;
                    }) 
            .sort((a,b) => a.date - b.date)
            
        this.initFocus()        
        this.initContext()
    }    

    update() {
        if (this.shouldUpdate) {
            
            const { margin, width, height, height2, margin2 } = this.extractSize()
            const { data } = this.props            

            const { xScale, xScale2, yScale, yScale2, xAxis, xAxis2, yAxis } = this.updateAxis()

            let drawFocusLine = line()
                .x(d => xScale(d.date))
                .y(d => yScale(d.price));

            const brushed = () => {
                const selection = event.selection;
                xScale.domain(selection.map(xScale2.invert, xScale2));
                this.focusGroup.selectAll(".dot")
                    .attr("cx", d => xScale(d.date))
                    .attr("cy", d => yScale(d.price));
                this.focusGroup.select(".axis--x").call(xAxis);

                this.focusGroup.selectAll(".line")
                    .attr("d", drawFocusLine);
            }
                
            const brush = brushX()
                            .extent([[0, 0], [width, height2]])
                            .on("brush", brushed);
                
            xScale.domain(extent(data, d =>  d.date));
            yScale.domain([0, max(data, d => d.price)+200]);
            xScale2.domain(xScale.domain());
            yScale2.domain(yScale.domain());

            { //other elements
                this.brushRect
                    .attr("width", width)
                    .attr("height", height);

                this.xText
                    .attr("transform",
                        "translate(" + ((width + margin.right + margin.left) / 2) + " ," +
                        (height + margin.top + margin.bottom) + ")")


                this.focusXAxis
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                this.focusYAxis.call(yAxis);

                this.focusYText
                    .attr("y", 0 - margin.left)
                    .attr("x", 0 - (height / 2))
            
            }

            { //focus G
                { //dots
                    /*     
                        scatterplot 
                            http://bl.ocks.org/WilliamQLiu/bd12f73d0b79d70bfbae
                            https://stackoverflow.com/questions/38065997/d3-js-attribute-setting-not-working-after-binding-data-and-entering-elements

                    */

                    // append scatter plot to main chart area 
                    
                    this.focusWidget.attr("clip-path", "url(#clip)");
                    let focusJoinDots = this.focusWidget.selectAll(".dot").data(data)

                    let focusEnterDots = focusJoinDots.enter()

                    focusEnterDots
                        .append("circle") // new/entering dots/data
                            .attr('class', 'dot')
                            .attr("r",1)
                            .style("opacity", .5)
                            .style("fill", orangeColour)
                            .attr("cx", d =>  xScale(d.date))
                            .attr("cy", d => yScale(d.price))
                        .on('mouseover', (d,indexMouse) => {                                                
                            // focusJoinDots
                            //     .enter()
                            //     .selectAll('.dot')
                            //     .filter((d,indexSelection) => {
                            //         let check=indexMouse === indexSelection
                            //         check && (temp = d)                                
                            //         return check
                            //     })
                            // console.log("mouseover on", temp, d, temp2);

                            focusEnterDots
                                .selectAll('.dot')
                                    .style("fill", orangeColour)
                                    .attr("r", 3)
                        })
                        .on('mouseout', d => {
                            focusEnterDots
                                .selectAll('.dot')
                                .style("fill", blueColour)
                                .attr("r", 1)
                        })
                        
                    focusJoinDots.exit().remove()
                }
                // append line graph to brush chart area

                { // line graph
                    let focusJoinLine = this.focusWidget.selectAll(".line").data([data])
                    
                    // [Update] transition from previous paths to new paths

                    this.focusWidget.selectAll('.line')
                        .style("stroke", blueColour)
                        .attr('d', drawFocusLine)

                    // [Enter] any new data
                    focusJoinLine.enter()
                        .insert('path', 'circle')
                        .attr('class', 'line')
                        .attr('d', drawFocusLine)
                            .style('stroke-width', '2px')
                            .style('fill', 'none')
                            .style("stroke", blueColour);

                    // [Exit]
                    focusJoinLine.exit()
                        .remove();
                }

                { //tooltips

                }
            }

            { // context G
                this.contextGroup
                    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
                
                // append scatter plot to brush chart area

                this.contextDots.attr("clip-path", "url(#clip)");
                
                let contextDots = this.contextDots.selectAll(".dot").data(data)

                contextDots
                    .enter()
                        .append("circle")
                        .attr('class', 'dot')
                    .merge(contextDots)
                        .attr("r", data.length < 150? 3 : 1 )
                        .style("opacity", .5)
                        .attr('fill-opacity', 0.6)
                        .style("fill", blueColour)
                        .attr("cx", d => xScale2(d.date))
                        .attr("cy", d => yScale2(d.price))

                this.contextXAxis
                    .attr("transform", "translate(0," + height2 + ")")
                    .call(xAxis2);

                this.contextBrush
                    .call(brush)
                    .call(brush.move, xScale.range());
            }
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
