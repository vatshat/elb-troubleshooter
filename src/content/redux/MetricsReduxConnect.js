import { connect } from 'react-redux'
import MetricsContainer from '../containers/MetricsContainer'
import * as metricsAction from '../actions/metricsAction'
import { timeParse } from 'd3-time-format'

const mapStateToProps = ({metrics}) => {
    let { metricWidgets } = metrics.metricsReducer

    metrics.metricsReducer.metricWidgets = 
        metricWidgets.map(x => {
            return {
                ...x,
                metricData: x.metricData
                                .slice(0, 250)
            }
        });

    return metrics;
};

const mapDispatchToProps = dispatch => ({ 
    // metrics   
    requestMetricsDispatch: () => dispatch(metricsAction.requestMetricsAction()),
    responseMetricsDispatch: xmlJSON => dispatch(metricsAction.responseMetricsAction(xmlJSON)),
    errorMetricsActionDispatch: errorMessage => dispatch(metricsAction.errorMetricsAction(errorMessage)),
    // creds
    requestCredsDispatch: () => dispatch(metricsAction.requestCredsAction()),
    responseCredsDispatch: response => dispatch(metricsAction.responseCredsAction(response)),
    errorCredsActionDispatch: errorMessage => dispatch(metricsAction.errorCredsAction(errorMessage)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MetricsContainer);