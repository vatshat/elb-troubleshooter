import React from 'react'
import { object, number, array, any, oneOf, bool } from 'prop-types'
import { loadingSVG } from './LoadingSVG'

// d3 imports
import { line } from 'd3-shape'
import { brushX } from 'd3-brush'
import { timeFormat } from 'd3-time-format'
import { axisBottom, axisLeft } from 'd3-axis'
import { max, extent, bisector, mean } from 'd3-array'
import { scaleLinear, scaleTime } from 'd3-scale'
import { transition, delay, } from 'd3-transition'
import { easeLinear } from 'd3-ease'
import { select, style, event, mouse } from 'd3-selection'

const blueColour = "rgb(36, 48, 64)"
const orangeColour = "rgb(203, 75, 22)"

export default class D3SVGComponent extends React.Component {
    
    static propTypes = {
        data: array.isRequired,
        status: oneOf(['loading', 'error', 'success']).isRequired,
        predictionStatus: oneOf(['training', 'show', 'hide', 'error', "success", "initial"]).isRequired,
    }

    static defaultProps = {
        margin: { top: 20, right: 20, bottom: 110, left: 50 },
        margin2: { top: 600 - 70, right: 20, bottom: 30, left: 50 },
        width: 800,
        height: 600,
        drawLine: true,
        predictionStatus: "initial",
    }

    constructor(props) {
        super(props)

        this.shouldUpdate = true;
        // minimal state to manage React lifecycle

        this.state = {
            initialized: false,
            oDOM: (translateX, translateY) => {
                return new DOMParser().parseFromString(
                            loadingSVG(translateX, translateY),
                            "image/svg+xml"
                        );
            } 
        };
    }

    componentDidMount() {
        this.init();
        // the code below is to trigger componentDidUpdate (which is not called at first render)
        setTimeout(() => {
            if (this.rootRefNode) {
                this.setState({ initialized: true });
            }
        });
    }

    componentDidUpdate({ margin, width, height, xDomain, yDomain, dataMean, drawLine, predictionStatus }) {
        if (
            margin !== this.props.margin || 
            width !== this.props.width || 
            height !== this.props.height ||
            xDomain !== this.props.xDomain ||
            yDomain !== this.props.yDomain ||
            dataMean !== this.props.dataMean ||
            drawLine !== this.props.drawLine
        ) {
            this.shouldUpdate = true;
        }
        
        if (this.shouldUpdate) {
            this.update();
            this.shouldUpdate = false
        }

        if (predictionStatus !== this.props.predictionStatus) {
            this.prediction()
        }
            
    }

    extractSize() {
        const { height: actualHeight, width: actualWidth, margin, margin2: defaultMargin2 } = this.props

        let width = actualWidth - margin.left - margin.right,
            height = actualHeight - margin.top - margin.bottom,
            margin2 = { ...defaultMargin2, top: actualHeight - 70},
            height2 = actualHeight - margin2.top - margin2.bottom;
            
        return { margin, margin2, width, height, height2 }
    }

    updateAxis() {
        const { width, height, height2 } = this.extractSize()

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

        if (this.props.status == "success") {
            this.brushRect = this.rootNode.append('defs')
                .append("clipPath")
                    .attr("id", `clip-${this.props.widgetId}`)
                    .append("rect")
                        .attr("width", width)
                        .attr("height", height);
        }

        this.focusGroup = this.rootNode.append('g')
            .attr("class", "focus")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        this.focusWidget = this.focusGroup.append("g");
        
        { // titile, x,y labels
            this.focusXAxis = this.focusGroup.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", `translate(0,${height})`)

            this.focusYAxis = this.focusGroup.append("g")
                .attr("class", "axis axis--y")

            this.xTitle = this.rootNode.append('text')
                .attr("transform", `translate( 0, 10 )`)
                .style("fill", orangeColour)
                .text("CPUUtilization");

            /*
            this.focusYText = this.focusGroup.append("text")
                .attr("transform", "rotate(-90)")

                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .style("fill", orangeColour)
                .text("Value");
            
            let translateX = ((width + margin.right + margin.left) / 2),
                translateY = (height + margin.top + margin.bottom)

            this.xText = this.rootNode.append('text')
                .attr("transform", `translate( ${translateX}, ${translateY} )`)
                .style("text-anchor", "middle")
                .style("fill", orangeColour)
                .text("Date");
            */
        }

        { // tooltips
                                     
            this.focusToolTip = this.focusWidget
                                    .append("g")
                                    .style("display", "none")
                                    .attr("class", "tooltip-container")

            // append the circle at the intersection
            this.focusToolTipCircle = this.focusToolTip
                .append("circle") 
                    .attr("class", "tooltip y") 
                    .style("stroke", blueColour)
                    .style("opacity", "1")
                    .style("fill", blueColour)
                    .attr("r", 2);
                                    
            this.focusRect = this.focusGroup
                                .append("rect")
                                    .style("fill", "none")
                                    .style("pointer-events", "all")
                                    .on("mouseover", () => this.focusToolTip.style("display", null))
                                    .on("mouseout", () => this.focusToolTip.style("display", "none"))

            // append the x line
            this.focusToolTip.append("line")
                .attr("class", "x")
                .style("stroke", orangeColour)
                .style("stroke-dasharray", "3,3")
                .style("opacity", 0.5)
                .attr("y1", 0)
                .attr("y2", height);

            // append the y line
            this.focusToolTip.append("line")
                .attr("class", "y")
                .style("stroke", orangeColour)
                .style("stroke-dasharray", "3,3")
                .style("opacity", 0.5)
                .attr("x1", width)
                .attr("x2", width);

            // place the value at the intersection
            this.focusToolTip.append("text")
                .attr("class", "y1")
                .style("stroke", "white")
                .style("stroke-width", "3.5px")
                .style("opacity", 0.8)
                .attr("dx", 8)
                .attr("dy", "-.3em");

            this.focusToolTip.append("text")
                .attr("class", "y2")
                .attr("dx", 8)
                .attr("dy", "-.3em");

            // place the date at the intersection
            this.focusToolTip.append("text")
                .attr("class", "y3")
                .style("stroke", "white")
                .style("stroke-width", "3.5px")
                .style("opacity", 0.8)
                .attr("dx", 8)
                .attr("dy", "1em");

            this.focusToolTip.append("text")
                .attr("class", "y4")
                .attr("dx", 8)
                .attr("dy", "1em");
        }
       
    }

    initContext() {
        
        const { margin2, height2 } = this.extractSize()
        const { status } = this.props;

        this.contextGroup = this.rootNode.append('g')
            .attr("class", `context ${(status == "success") ? "show" : "hide"}`)
            .attr("transform", `translate( ${margin2.left} , ${margin2.top})`);

        this.contextDots = this.contextGroup.append("g");

        this.contextXAxis = this.contextGroup.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", `translate(0, ${height2} )`);

        if (status == "success") {
            this.contextBrush = this.contextGroup.append("g")
                .attr("class", "brush");            
        }
    }

    init() {                    
        this.initFocus()        
        this.initContext()
    }    

    update() {
                    
        const { margin, width, height, height2, margin2 } = this.extractSize()
        const { data, status } = this.props            

        const { xScale, xScale2, yScale, yScale2, xAxis, xAxis2, yAxis } = this.updateAxis()
        
        let drawFocusLine = line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.value));

        const brushed = () => {
            const selection = event.selection;
            xScale.domain(selection.map(xScale2.invert, xScale2));
            this.focusGroup.selectAll(".dot")
                .attr("cx", d => xScale(d.date))
                .attr("cy", d => yScale(d.value));
            this.focusGroup.select(".axis--x").call(xAxis);

            this.focusGroup.selectAll(".line")
                .attr("d", drawFocusLine);
        }
            
        const brush = brushX()
                        .extent([[0, 0], [width, height2]])
                        .on("brush", brushed);

        xScale.domain(extent(data, d =>  d.date));
        yScale.domain([0, max(data, d => d.value)*1.1]);
        xScale2.domain(xScale.domain());
        yScale2.domain(yScale.domain());

        { //other elements
            if (status == "success") {
                this.brushRect
                    .attr("width", width)
                    .attr("height", height);
            }

            this.focusXAxis
                .attr("transform", `translate(0, ${height})`)
                .call(xAxis);

            this.focusYAxis.call(yAxis);

            /*
            let translateX = ((width + margin.right + margin.left) / 2),
                translateY = (height + margin.top + margin.bottom)

            this.xText
                .attr("transform", `translate( ${translateX} , ${translateY} )`)

            this.focusYText
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height / 2))
            */
        
        }

        { //focus G

            if (status == "success") {
                this.focusWidget.attr("clip-path", `url(#clip-${this.props.widgetId})`);
            }
            
            { // grid lines
                
                // add the X gridlines
                this.focusWidget.append("g")
                    .attr("class", "grid")
                    .attr("transform", `translate(0, ${height})`)
                    .call(axisBottom(xScale)
                        .ticks(5)
                        .tickSize(-height)
                        .tickFormat("")
                    )

                // add the Y gridlines
                this.focusWidget.append("g")
                    .attr("class", "grid")
                    .call(axisLeft(yScale)
                        .ticks(5)
                        .tickSize(-width)
                        .tickFormat("")
                    )
            }

            { // line graph

                let focusJoinLine = this.focusWidget.selectAll(".line").data([data])

                // [Update] transition from previous paths to new paths

                this.focusWidget.selectAll('.line')
                    .style("stroke", blueColour)
                    .attr('d', drawFocusLine)

                // [Enter] any new data
                focusJoinLine.enter()
                    .append('path')
                    .attr('class', 'line')
                    .attr('d', drawFocusLine)
                    .style('fill', 'none')
                    .style("stroke", blueColour);

                // [Exit]
                focusJoinLine.exit()
                    .remove();

                focusJoinLine
                    .transition()
                    .delay(1000)
                    .ease(easeLinear)
                    .style('stroke-width', this.props.drawLine ? '2px' : '0px')

            }
            
            { //dots

                    // scatterplot 
                    //     http://bl.ocks.org/WilliamQLiu/bd12f73d0b79d70bfbae
                    //     https://stackoverflow.com/questions/38065997/d3-js-attribute-setting-not-working-after-binding-data-and-entering-elements


                // append scatter plot to main chart area 
                
                let focusJoinDots = this.focusWidget.selectAll(".dot").data(data)

                let focusEnterDots = focusJoinDots.enter()
                
                focusEnterDots
                    .append("circle") // new/entering dots/data
                        .attr('class', 'dot')
                        .attr("r",1)
                        .style("opacity", .5)
                        .style("fill", orangeColour)
                        .style("stroke", orangeColour)
                        .attr("cx", d =>  xScale(d.date))
                        .attr("cy", d => yScale(d.value))

                focusJoinDots.exit().remove()

            }
            // append line graph to brush chart area

            { //tooltips
                const bisectDate = bisector(d => d.date).left,
                        formatDate = timeFormat("%d-%b-%y");

                let mousemove = () => {

                    let mouseInvert = mouse(this.focusRect._groups[0][0])

                    let x0 = xScale.invert(mouseInvert[0]),
                        i = bisectDate(data, x0, 1),
                        d0 = data[i - 1],
                        d1 = data[i],
                        d = x0 - d0.date > d1.date - x0 ? d1 : d0;

                    let translateY = `translate( ${ xScale(d.date) } , ${ yScale(d.value) } )`

                    this.focusToolTipCircle
                        .attr("transform", translateY);

                    this.focusToolTip.select("circle.y")
                        .attr("transform", translateY);

                    this.focusToolTip.select("text.y1")
                        .attr("transform", translateY)
                        .text(d.value);

                    this.focusToolTip.select("text.y2")
                        .attr("transform", translateY)
                        .text(d.value);

                    this.focusToolTip.select("text.y3")
                        .attr("transform", translateY)
                        .text(formatDate(d.date));

                    this.focusToolTip.select("text.y4")
                        .attr("transform", translateY)
                        .text(formatDate(d.date));

                    this.focusToolTip.select("line.x")
                        .attr("transform", translateY)
                        .attr("y2", height - yScale(d.value));

                    this.focusToolTip.select("line.y")
                        .attr("transform", `translate( ${width * -1} , ${ yScale(d.value) } )`)
                        .attr("x2", width + width);
                }

                if (status == "success") {
                    this.focusRect 
                        .attr("width", width)
                        .attr("height", height)
                        .on("mousemove", mousemove);
                }

            }
        }

        { // context G
            this.contextGroup
                .attr("transform", `translate(${margin2.left} , ${margin2.top} )`);
            
            // append scatter plot to brush chart area

            this.contextDots.attr("clip-path", `url(#clip-${this.props.widgetId})`);
            
            let contextDots = this.contextDots.selectAll(".dot").data(data)

            contextDots
                .enter()
                    .append("circle")
                    .attr('class', 'dot')
                .merge(contextDots)
                    .attr("r", data.length < 300? 3 : 1 )
                    .style("opacity", .5)
                    .attr('fill-opacity', 0.6)
                    .style("fill", blueColour)
                    .attr("cx", d => xScale2(d.date))
                    .attr("cy", d => yScale2(d.value))

            this.contextXAxis
                .attr("transform", `translate(0, ${height2} )`)
                .call(xAxis2);

            if (status == "success") {
                this.contextBrush
                    .call(brush)
                    .call(brush.move, xScale.range());
            }

        }

        { // loader
            let 
                translateX = ((width - margin.right - margin.left)),
                translateY = ((height - margin.top - margin.bottom)),
                svgLoader = this.rootRefNode.querySelectorAll("svg.svg-loading");

            if (status == "loading") {
                if (svgLoader.length == 0) {
                    this.rootRefNode.querySelector("g.focus").appendChild(this.state.oDOM(translateX, translateY).documentElement);
                }
                else {
                    this.focusGroup.select("svg.svg-loading g")
                        .attr("transform", `translate(${translateX/2}, ${translateY/2} )`)
                }
            }
            else if(status == "error") {
                this.focusGroup.selectAll("svg.svg-loading circle")
                    .remove()

                let loadErrorMessage = this.focusGroup.select("svg.svg-loading text").empty()
                
                if (loadErrorMessage) {
                    this.focusGroup.select("svg.svg-loading g")
                                    .append('text')
                                        .style("text-anchor", "middle")
                                        .style("fill", orangeColour)
                                        .text(this.props.errorMessage);
                }

            }
        }
    }

    prediction() {
        const 
            { margin, width, height } = this.extractSize(),
            svgLoader = this.rootRefNode.querySelectorAll("svg.svg-loading"),
            translateX = ((width - margin.right - margin.left)),
            translateY = ((height - margin.top - margin.bottom));

        if (svgLoader.length == 0) {
            let loadingSVG = this.rootRefNode
                            .appendChild(this.state.oDOM(translateX, translateY).documentElement);

            loadingSVG.classList.add("prediction", "hide");

            this.rootRefNode.childNodes.forEach(node => {
                node.classList.add("prediction");
            });
        }

        let 
            togglePredictionLoading = training => {
                this.rootRefNode.childNodes.forEach(node => {

                    if (
                        node.localName == "svg" && 
                        node.classList.contains("prediction") 
                    ) {
                        node.classList.add(training  ? "show" : "hide");
                        node.classList.remove(training ? "hide" : "show");
                    }
                    else {
                        node.classList.remove(training ? "show" : "hide");
                        node.classList.add(training ? "hide" : "show");
                    }
                    
                });
            };

        switch (this.props.predictionStatus) {
            case "error":
            case "success":
                togglePredictionLoading(false);
                break;
            case "training":
            default:
                togglePredictionLoading(true);
        }        
    }

    render() {        
        
        const { margin, width, height } = this.extractSize()

        return <svg className="root-svg" 
                    ref={ node => 
                        {
                            this.rootRefNode = node
                            this.rootNode = select(node)
                        } 
                    }
                    width = { width + margin.left + margin.right }
                    height = { height + margin.top + margin.bottom } 
                    xmlns={"http://www.w3.org/2000/svg"}
                >

                </svg>
    }

} 