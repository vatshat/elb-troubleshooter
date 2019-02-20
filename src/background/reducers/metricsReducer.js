const initialCredsState = {
    stsStatus: "initial",
    creds: {},
    roleArn: "arn:aws:iam::037559324442:role/anomaly-detector",
    expiration: "1970-01-01T00:00:00Z",
}

const credsReducer = (state = initialCredsState, action) => {
    switch(action.type) {
        case 'STS_CREDS_PENDING': {
            return {
                ...state,
                creds: {},
                expiration: "1970-01-01T00:00:00.000Z",
                stsStatus: "loading"
            }
        }

        case 'STS_CREDS_REJECTED': {
            // delete state.metricWidgets
            return {
                ...state,
                stsStatus: "error",
                metricsError: action.errorMessage,
            }
        }

        case 'STS_CREDS_FULFILLED': {
            return {
                ...state,
                stsStatus: "success",
                expiration: action.responseCreds.expiration,
                creds: {...action.responseCreds.creds},
            }
        }

        default: 
            return state;
    }
}

const 
    currentTime = new Date(),
    initialMetricsState = {
        metricsStatus: "loading", 
        metricWidgets: [{
            "id": (() => (
                Math
                .random()
                .toString(36)
                .substring(2, 15) +
                Math.random().toString(36).substring(2, 15)
            ))(),
            "Label": "Metric",
            "metricData": [{
                "date": "1970-01-01T00:00:00Z",
                "value": 1
            }]
        }],
        selectedMetrics: {
            endtime: currentTime.toISOString(),
            startTime: new Date(currentTime.setDate(currentTime.getDate() - 5)).toISOString(),
            members: [{
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
        }
    };

const metricsReducer = (state = initialMetricsState, action) => {
    switch (action.type) {
        case 'TEST_ACTION':
            return {
                ...state
            }

        case 'FETCH_METRICS_PENDING':
            return {
                ...state,
                metricsStatus: "loading"
            }
            
        case 'FETCH_METRICS_REJECTED': {      
            delete state.metricWidgets
            return { 
                ...state,
                metricsStatus: "error",
                metricsError: action.errorMessage,
            }
        }
        
        case 'FETCH_METRICS_FULFILLED': {
            delete state.errorMessage
            return {
                ...state,
                metricWidgets: action.response,
                metricsStatus: "success"
            }
        }

    default:
        return state;
    }
}

const metricManager = (state = {}, action) => {
    return {
        metricsReducer: metricsReducer(state.metricsReducer, action),
        credsReducer: credsReducer(state.credsReducer, action)
    }
}

export default metricManager;