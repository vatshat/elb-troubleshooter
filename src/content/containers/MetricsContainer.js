import React from 'react';
import aws4 from 'aws4'
import { parseString } from 'xml2js'
import { func, object } from 'prop-types'
import WidgetComponent from '../components/metrics/WidgetComponent'
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
        this.checkSTSLocalStorage(this.props.credsReducer)
    }
    
    componentDidUpdate({credsReducer: {stsStatus: prevStsStatus} }) {        
        let {stsStatus, creds} = this.props.credsReducer

        if (stsStatus !== prevStsStatus && stsStatus === "success") {
            this.fetchMetricData(creds)
        }
    }

    componentWillUnmount = () => this.abortController.abort();
    abortController = new window.AbortController();

    checkSTSLocalStorage(credsReducer) {
        try {
            chrome.storage.local.get(['stsCreds'], result => {
                if (typeof result.stsCreds === "string") {
                    let cachedCreds = JSON.parse(result.stsCreds);
    
                    if (new Date(cachedCreds.expiration).getTime() > new Date().getTime()) {                        
                        credsReducer.creds = cachedCreds.creds
                        credsReducer.expiration = cachedCreds.expiration;                        
                    }
                }
                this.getSTSBeforeFetch(credsReducer)
            });
        } catch (ex) { this.getSTSBeforeFetch(credsReducer) }

    }

    getSTSBeforeFetch({expiration, stsStatus, roleArn, creds}) {

        if (new Date(expiration).getTime() < new Date().getTime()) {

            if (stsStatus !== "loading") {
                this.props.requestCredsDispatch()
                
                // https://hackernoon.com/https-medium-com-amanhimself-converting-a-buffer-to-json-and-utf8-strings-in-nodejs-2150b1e3de57

                let
                    creds = JSON.stringify({
                        "type": "Buffer",
                        "data": [123, 34, 97, 99, 99, 101, 115, 115, 75, 101, 121, 73, 100, 34, 58, 34, 65, 75, 73, 65, 74, 89, 85, 70, 51, 75, 73, 55, 85, 78, 71, 79, 72, 50, 82, 81, 34, 44, 34, 115, 101, 99, 114, 101, 116, 65, 99, 99, 101, 115, 115, 75, 101, 121, 34, 58, 34, 109, 43, 107, 67, 111, 88, 97, 74, 108, 84, 54, 49, 111, 50, 115, 117, 85, 79, 98, 102, 65, 116, 119, 78, 77, 49, 100, 101, 122, 70, 103, 70, 80, 72, 56, 110, 121, 83, 76, 71, 34, 125],
                    });

                creds = Buffer.from(JSON.parse(creds).data),
                creds = JSON.parse(creds.toString());

                let
                    sts = new STS({ credentials: creds }),
                    params = {
                        Policy: `{"Version":"2012-10-17","Statement":[{"Sid":"747368911612","Effect":"Allow","Action":["cloudwatch:GetMetricData","cloudwatch:ListMetrics"],"Resource":"*"}]}`,
                        RoleArn: roleArn,
                        RoleSessionName: "anomaly-detector"
                    };
    
                sts.assumeRole(params, (err, {Credentials}) => {
                    if (err) this.props.errorCredsActionDispatch(err.code) // check docs for code meaning
                    else {

                        let creds = (
                            ({
                                AccessKeyId,
                                SecretAccessKey,
                                SessionToken,
                                Expiration
                            }) => ({
                                'expiration': Expiration,
                                'creds': {
                                    'accessKeyId': AccessKeyId,
                                    'secretAccessKey': SecretAccessKey,
                                    'sessionToken': SessionToken,
                                }
                            })
                        )(Credentials)

                        try {
                            chrome.storage.local.set({stsCreds: JSON.stringify(creds)}, () => {});
                        }
                        catch (ex) {}

                        this.props.responseCredsDispatch(creds); // add ajv validator for this response
                    }
                });    
            }
        } 
        else {
            var test = "testing";
            this.fetchMetricData(creds)
        }
    }

    fetchMetricData(creds) {
        
        this.props.requestMetricsDispatch()

        let                
            opts =
                aws4.sign(
                    {
                        host: 'monitoring.eu-west-1.amazonaws.com',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        method: 'POST',
                        path: '/',
                        body: Object.keys(this.props.metricsReducer.query)
                                    .map( k => encodeURIComponent(k) + '=' + encodeURIComponent(this.props.metricsReducer.query[k]) )
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