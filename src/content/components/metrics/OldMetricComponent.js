import React from 'react'
import { object, number, array, any } from 'prop-types'
import { line } from 'd3-shape'
import { brushX } from 'd3-brush'
import { max, extent, bisector } from 'd3-array'
import { csv } from 'd3-fetch'
import { timeParse, timeFormat } from 'd3-time-format'
import { axisBottom, axisLeft } from 'd3-axis'
import { scaleLinear, scaleTime } from 'd3-scale'
import { transition, delay } from 'd3-transition'
import { select, style, event, mouse } from 'd3-selection'

const blueColour = "rgb(36, 48, 64)"
const orangeColour = "rgb(203, 75, 22)"

export class BrushScatterMetricComponents extends React.Component {
    
    static propTypes = {
        data: array.isRequired,
    }

    static defaultProps = {
        margin: { top: 20, right: 20, bottom: 110, left: 50 },
        margin2: { top: 600 - 70, right: 20, bottom: 30, left: 50 },
        width: 800,
        height: 600,
        optional: {scatterplot: false}
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
        
        if (this.shouldUpdate) {
            this.update();
            this.shouldUpdate = false
        }
            
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

        this.brushRect = this.rootNode.append('defs')
            .append("clipPath")
                .attr("id", "clip")
                .append("rect")
                    .attr("width", width)
                    .attr("height", height);

        this.focusGroup = this.rootNode.append('g')
            .attr("class", "focus")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        this.focusWidget = this.focusGroup.append("g");
        
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
       
        { // x,y labels
            this.focusXAxis = this.focusGroup.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", `translate(0,${height})`)

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

            let translateX = ((width + margin.right + margin.left) / 2),
                translateY = (height + margin.top + margin.bottom)

            this.xText = this.rootNode.append('text')
                .attr("transform", `translate( ${translateX}, ${translateY} )`)
                .style("text-anchor", "middle")
                .style("fill", orangeColour)
                .text("Date");
        }
    }

    initContext() {
        
        const { margin2, height2 } = this.extractSize()

        this.contextGroup = this.rootNode.append('g')
            .attr("class", "context")
            .attr("transform", `translate( ${margin2.left} , ${margin2.top})`);

        this.contextDots = this.contextGroup.append("g");

        this.contextXAxis = this.contextGroup.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", `translate(0, ${height2} )`);

        this.contextBrush = this.contextGroup.append("g")
            .attr("class", "brush");
    }

    init() {                    
        this.initFocus()        
        this.initContext()
    }    

    update() {
                    
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
        yScale.domain([0, max(data, d => d.price)*1.05]);
        xScale2.domain(xScale.domain());
        yScale2.domain(yScale.domain());

        { //other elements
            this.brushRect
                .attr("width", width)
                .attr("height", height);

            let translateX = ((width + margin.right + margin.left) / 2),
                translateY = (height + margin.top + margin.bottom)

            this.xText
                .attr("transform", `translate( ${translateX} , ${translateY} )`)

            this.focusXAxis
                .attr("transform", `translate(0, ${height})`)
                .call(xAxis);

            this.focusYAxis.call(yAxis);

            this.focusYText
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height / 2))
        
        }

        { //focus G

            this.focusWidget.attr("clip-path", "url(#clip)");
            
            { //dots

                /////// ADD SCATTER PLOT AS AN OPTION via props/redux TO THE GRAPH (LIKE enable prediction)!!!! ///////

                    // scatterplot 
                    //     http://bl.ocks.org/WilliamQLiu/bd12f73d0b79d70bfbae
                    //     https://stackoverflow.com/questions/38065997/d3-js-attribute-setting-not-working-after-binding-data-and-entering-elements


                // append scatter plot to main chart area 
                
                if (this.props.optional.scatterPlot) {
                    let focusJoinDots = this.focusWidget.selectAll(".dot").data(data)
    
                    let focusEnterDots = focusJoinDots.enter()
                    
                    focusEnterDots
                        .append("circle") // new/entering dots/data
                            .attr('class', 'dot')
                            .attr("r",2)
                            .style("opacity", .5)
                            .style("fill", orangeColour)
                            .style("stroke", orangeColour)
                            .attr("cx", d =>  xScale(d.date))
                            .attr("cy", d => yScale(d.price))
    
                    focusJoinDots.exit().remove()
                }
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
                    .insert('path', 'g')
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
                const bisectDate = bisector(d => d.date).left,
                        formatDate = timeFormat("%d-%b-%y");

                let mousemove = () => {

                    let mouseInvert = mouse(this.focusRect._groups[0][0])
                    let x0 = xScale.invert(mouseInvert[0]),
                        i = bisectDate(data, x0, 1),
                        d0 = data[i - 1],
                        d1 = data[i],
                        d = x0 - d0.date > d1.date - x0 ? d1 : d0;

                    let translateY = `translate( ${ xScale(d.date) } , ${ yScale(d.price) } )`

                    this.focusToolTipCircle
                        .attr("transform", translateY);

                    this.focusToolTip.select("circle.y")
                        .attr("transform", translateY);

                    this.focusToolTip.select("text.y1")
                        .attr("transform", translateY)
                        .text(d.price);

                    this.focusToolTip.select("text.y2")
                        .attr("transform", translateY)
                        .text(d.price);

                    this.focusToolTip.select("text.y3")
                        .attr("transform", translateY)
                        .text(formatDate(d.date));

                    this.focusToolTip.select("text.y4")
                        .attr("transform", translateY)
                        .text(formatDate(d.date));

                    this.focusToolTip.select("line.x")
                        .attr("transform", translateY)
                        .attr("y2", height - yScale(d.price));

                    this.focusToolTip.select("line.y")
                        .attr("transform", `translate( ${width * -1} , ${ yScale(d.price) } )`)
                        .attr("x2", width + width);
                }

                this.focusRect 
                    .attr("width", width)
                    .attr("height", height)
                    .on("mousemove", mousemove);

            }
        }

        { // context G
            this.contextGroup
                .attr("transform", `translate(${margin2.left} , ${margin2.top} )`);
            
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
                .attr("transform", `translate(0, ${height2} )`)
                .call(xAxis2);

            this.contextBrush
                .call(brush)
                .call(brush.move, xScale.range());
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