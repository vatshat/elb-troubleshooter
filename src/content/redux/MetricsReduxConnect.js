import { connect } from 'react-redux'
import MetricsContainer from '../containers/MetricsContainer'
import * as metricsAction from '../actions/metricsAction'

const mapStateToProps = ({metrics}) => {
    let { metricWidgets, selectedMetrics } = metrics.metricsReducer

    metrics.metricsReducer.metricWidgets = 
        metricWidgets.map(x => {
            return {
                ...x,
                metricData: x.metricData
                    // add time feature here
                    // .slice(0, 500)
            }
        });

        let
            queryGenerator = metricDataQueries => {
                let query = {
                    "EndTime": metricDataQueries.endtime,
                    "Version": "2010-08-01",
                    "Action": "GetMetricData",
                    "StartTime": metricDataQueries.startTime,
                }

                metricDataQueries.members.map((m, i) => {
                    i++
                    query = {
                        ...query,
                        [`MetricDataQueries.member.${i}.MetricStat.Stat`]: m.stat,
                        [`MetricDataQueries.member.${i}.MetricStat.Metric.MetricName`]: m.metricName,
                        [`MetricDataQueries.member.${i}.Id`]: `m${i}`,
                        [`MetricDataQueries.member.${i}.ReturnData`]: "true",
                        [`MetricDataQueries.member.${i}.MetricStat.Metric.Namespace`]: m.nameSpace,
                        [`MetricDataQueries.member.${i}.MetricStat.Period`]: m.period,
                        [`MetricDataQueries.member.${i}.Label`]: m.metricName,
                    }

                    m.memberDimensions.map((mD, mI) => {
                        mI++
                        query = {
                            ...query,
                            [`MetricDataQueries.member.${i}.MetricStat.Metric.Dimension.${mI}.Name`]: mD.Name,
                            [`MetricDataQueries.member.${i}.MetricStat.Metric.Dimension.${mI}.Value`]: mD.Value,

                        }
                    })
                });

                return query
            },
            query = queryGenerator(selectedMetrics)

    metrics.metricsReducer.query = query    

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

    // prediction 

    predictionStatusDispatch: predictionStatus => dispatch(metricsAction.predictionStatusAction(predictionStatus)),
    predictionCompleteDispatch: predictedDatapoints => dispatch(metricsAction.predictionCompleteAction(predictedDatapoints)),
    
    predictionInitializeDispatch: id => dispatch(metricsAction.predictionInitializeAction(id)),
    predictionProgressDispatch: predictionProgress => dispatch(metricsAction.predictionProgressAction(predictionProgress)),    

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MetricsContainer);