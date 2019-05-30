import React from 'react';
import { func, object } from 'prop-types'
import WidgetContainer from './metrics/WidgetContainer'
import * as GetMetricData from './metrics/GetMetricData';
// import WidgetComponent from '../components/metrics/WidgetComponent'

if (typeof fetch !== 'function') {
    if (typeof window !=='object') global.fetch = require('node-fetch');
    else window.fetch = require('node-fetch');
}

// https://robwise.github.io/blog/cancel-whatwg-fetch-requests-in-react

if (typeof AbortController !== 'function') {
    if (typeof window !== 'object') global.AbortController = require('abortcontroller-polyfill/dist/cjs-ponyfill');
    else window.AbortController = require('abortcontroller-polyfill/dist/cjs-ponyfill');
}

const MetricsContainer = props => {
    const metricWidgetsJSX = props.metricsReducer.metricWidgets
        .map(metricWidget => {                                
            return <div 
                        key = { metricWidget.id }
                        className="widget-scrollbar col-lg-6">

                        <WidgetContainer
                            errorMessage = {props.metricsReducer.errorMessage}
                            metricData = { metricWidget.metricData }                            
                            key = { metricWidget.id }
                            id = { metricWidget.id }
                            metricName = { metricWidget.label }
                            fetchMetricStatus = { props.metricsReducer.metricsStatus }

                            predictionStatus = { props.predictionsReducer.predictionStatus }
                            predictionProgress = {  props.predictionsReducer.predictionProgress[metricWidget.id] }

                            predictedDatapoints = { props.predictionsReducer.predictedDatapoints[metricWidget.id] }
                            
                            predictionStatusDispatch = { props.predictionStatusDispatch }
                            predictionProgressDispatch = { props.predictionProgressDispatch }
                            predictionCompleteDispatch = { props.predictionCompleteDispatch }
                            
                        />
                    </div>
        })

    return ( 
        <div>
            <h1>
                Metrics
            </h1>
            
            {metricWidgetsJSX}
            
        </div>
    );
}

const HOCMetricsContainer = MetricsContainer => class extends React.Component {
    checkSTSLocalStorage = GetMetricData.sts.bind(this)
    fetchMetricData = GetMetricData.fetchMetricData.bind(this)

    static propTypes = { 
        metricsReducer: object.isRequired,
        credsReducer: object.isRequired,
        errorMetricsActionDispatch: func.isRequired,
        requestMetricsDispatch: func.isRequired,
        responseMetricsDispatch: func.isRequired,
        predictionStatusDispatch: func.isRequired,
    }

    componentDidMount() {
        
        this.checkSTSLocalStorage(this.props)().then(currentCredsValid => {
            currentCredsValid && this.fetchMetricData(this.props, this.abortController)
        });        
    }
    
    componentDidUpdate({credsReducer: {stsStatus: prevStsStatus} }) {        
        let 
            {props} = this,
            {stsStatus} = props.credsReducer

        if (stsStatus !== prevStsStatus && stsStatus === "success") {
            this.fetchMetricData(props)
        }
    }

    componentWillUnmount = () => this.abortController.abort();
    abortController = new window.AbortController();

    render() {
        return <MetricsContainer
            {...this.props}
        />
    }
}

export default HOCMetricsContainer(MetricsContainer)