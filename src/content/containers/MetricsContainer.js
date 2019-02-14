import React from 'react';
import aws4 from 'aws4'
import { parseString } from 'xml2js'
import { object, number, array, any, func } from 'prop-types'
import WidgetComponent from '../components/metrics/WidgetComponent'
import { timeParse } from 'd3-time-format'

export default class MetricsContainer extends React.Component {
    fetchMetricData = this.fetchMetricData.bind(this)

    static propTypes = { 
        metricData: array.isRequired,
        errorMetricsActionDispatch: func.isRequired,
        requestMetricsDispatch: func.isRequired,
        responseMetricsDispatch: func.isRequired,
    }

    componentDidMount() {
        this.fetchMetricData()
    }
    
    fetchMetricData() {
        
        this.props.requestMetricsDispatch()

        let
            currentTime = new Date(),
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
            query =
                queryGenerator({
                    endtime: currentTime.toISOString(),
                    startTime: new Date(currentTime.setDate(currentTime.getDate() - 5)).toISOString(),
                    members: [
                        {
                            stat: "Sum",
                            metricName: "IncomingBytes",
                            nameSpace: "AWS/Logs",
                            period: 300,
                            memberDimensions: [{
                                Name: "LogGroupName",
                                Value: "CloudTrail/DefaultLogGroup"
                            }]
                        }, 
                        {
                            stat: "Maximum",
                            metricName: "IncomingLogEvents",
                            nameSpace: "AWS/Logs",
                            period: 300,
                            memberDimensions: [{
                                Name: "LogGroupName",
                                Value: "CloudTrail/DefaultLogGroup"
                            }]
                        },

                    ],
                }),
            // sort out dynamiaclly getting region, accessKeyId, secretAccessKey
            opts =
                aws4.sign(
                    {
                        host: 'monitoring.eu-west-1.amazonaws.com',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        method: 'POST',
                        path: '/',
                        body: Object.keys(query)
                                    .map( k => encodeURIComponent(k) + '=' + encodeURIComponent(query[k]) )
                                    .join('&'),
                    }
                    , {
                        accessKeyId: 'AKIAIBGW3XOTGH37TWMQ',
                        secretAccessKey: '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',
                    }
                )

        fetch(
            `https://${opts.headers.Host}${opts.path}`,
            {
                method: "POST",
                headers: {...opts.headers},
                body: opts.body,
            }
        )
        .then( response => response.text() )
        .then(xml => {
            parseString(xml, (err, json) => {
                // add ajv validator before sending to store as success!!!!!!!!
                this.props.responseMetricsDispatch(json);
            })
        })
        .catch(error => { this.props.errorMetricsActionDispatch(error.message) });
    }

    render() {
        const metricWidgets = this.props.metricsReducer.metricWidgets
            .map((metricWidget, widgetIndex) => {

                let temp = metricWidget["metricData"].map(x => {
                    return {
                        ...x,
                        date: timeParse("%Y-%m-%dT%H:%M:%SZ")(x.date)
                    }
                })

                return <div className="widget-scrollbar col-lg-6">
                            <WidgetComponent 
                                errorMessage = {this.props.errorMessage}
                                data = { temp }
                                dataMean = { metricWidget["metricData"].reduce((total, dataPoint) => total + dataPoint["Values"]) / metricWidget.length }
                                widgetId={ metricWidget["id"] } 
                                key= { `${metricWidget["id"]}${widgetIndex}`}
                                status = {this.props.status}
                            />
                        </div>
            })

        return ( 
            <div>
                <h1>
                    Metrics
                </h1>
                
                {metricWidgets}

                {
                    /*                         
                        <pre className="col-lg-4">
                            {
                                JSON.stringify(this.props.metricsWidget, null, 2)
                            }
                        </pre>              
                    */
                }
            </div>
        );
    }
}