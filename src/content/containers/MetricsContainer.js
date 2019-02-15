import React from 'react';
import aws4 from 'aws4'
import { parseString } from 'xml2js'
import { func, object } from 'prop-types'
import WidgetComponent from '../components/metrics/WidgetComponent'
import AWS from 'aws-sdk/global';
import STS from 'aws-sdk/clients/sts';
import { timeParse } from 'd3-time-format'

if (typeof fetch !== 'function') {
    if (typeof window !=='object') global.fetch = require('node-fetch');
    else window.fetch = require('node-fetch');
}

// https://robwise.github.io/blog/cancel-whatwg-fetch-requests-in-react
if (typeof AbortController !== 'function') {
    if (typeof window !== 'object') global.AbortController = require('abortcontroller-polyfill/dist/cjs-ponyfill');
    else window.AbortController = require('abortcontroller-polyfill/dist/cjs-ponyfill');
}

export default class MetricsContainer extends React.Component {
    fetchMetricData = this.fetchMetricData.bind(this)

    static propTypes = { 
        metricsReducer: object.isRequired,
        credsReducer: object.isRequired,
        errorMetricsActionDispatch: func.isRequired,
        requestMetricsDispatch: func.isRequired,
        responseMetricsDispatch: func.isRequired,
    }

    componentDidMount() {
        /* this.fetchMetricData({
            accessKeyId: "AKIAJSPIKEHCJDICSXXQ",
            secretAccessKey: "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",
        }) */
        this.getSTSBeforeFetch(this.props.credsReducer)
    }
    
    componentDidUpdate({credsReducer: {stsStatus: prevStsStatus} }) {        
        let {stsStatus, creds} = this.props.credsReducer

        if (stsStatus !== prevStsStatus && stsStatus === "success") {
            this.fetchMetricData(creds)
        }
    }

    componentWillUnmount = () => this.abortController.abort();
    abortController = new window.AbortController();

    getSTSBeforeFetch({expiration, stsStatus, roleArn}) {

        if (new Date(expiration) < new Date()) {

            if (stsStatus !== "loading") {
                this.props.requestCredsDispatch()
                
                let
                    creds = new AWS.Credentials({
                        accessKeyId: "AKIAJCBHMGLCFXZ2NDQA",
                        secretAccessKey: "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",
                    }),
                    sts = new STS({ credentials: creds }),
                    params = {
                        Policy: `{"Version":"2012-10-17","Statement":[{"Sid":"747368911612","Effect":"Allow","Action":["cloudwatch:GetMetricData","cloudwatch:ListMetrics"],"Resource":"*"}]}`,
                        RoleArn: roleArn,
                        RoleSessionName: "anomaly-detector"
                    };
    
                sts.assumeRole(params, (err, response) => {
                    if (err) this.props.errorCredsActionDispatch(err.code) // check docs for code meaning
                    else this.props.responseCredsDispatch(response); // add ajv validator for this response
                });
    
            }
            else { this.fetchMetricData(creds) }

        }
    }

    fetchMetricData(creds) {
        
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
                    }, 
                    creds
                )

        fetch(
            `https://${opts.headers.Host}${opts.path}`,
            {
                method: "POST",
                headers: {...opts.headers},
                body: opts.body,
                signal: this.abortController.signal
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
            .map(metricWidget => {                                
                return <div 
                            key = { metricWidget.id }
                            className="widget-scrollbar col-lg-6">

                            <WidgetComponent 
                                errorMessage = {this.props.metricsReducer.errorMessage}
                                data = { 
                                    metricWidget
                                        .metricData
                                        .map(x => {
                                            return {
                                                ...x,
                                                date: timeParse("%Y-%m-%dT%H:%M:%SZ")(JSON.parse(JSON.stringify(x.date)))
                                            }
                                        })
                                        .sort((a, b) => a.date - b.date)
                                }
                                dataMean = { metricWidget.metricData.reduce((total, dataPoint) => total + dataPoint.value, 0) / metricWidget.metricData.length }
                                key = { metricWidget.id }
                                status = {this.props.metricsReducer.metricsStatus}
                            />
                        </div>
            })

        return ( 
            <div>
                <h1>
                    Metrics
                </h1>
                
                {metricWidgets}
                
            </div>
        );
    }
}