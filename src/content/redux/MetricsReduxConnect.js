import { connect } from 'react-redux'
import MetricsContainer from '../containers/MetricsContainer'
import * as metricsAction from '../actions/metricsAction'

const mapStateToProps = state => {
    let { metricWidgets } = state.metrics.metricsReducer

    state.metrics.metricsReducer.metricWidgets = metricWidgets.map(x => {
                                        return {
                                            ...x,
                                            metricData: x.metricData.slice(0, 250)
                                        }
                                    });

    return state.metrics;
};

const mapDispatchToProps = dispatch => ({    
    requestMetricsDispatch: () => dispatch(metricsAction.requestMetricsAction()),
    responseMetricsDispatch: xmlJSON => dispatch(metricsAction.responseMetricsAction(xmlJSON)),
    errorMetricsActionDispatch: errorMessage => dispatch(metricsAction.errorMetricsAction(errorMessage)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MetricsContainer);