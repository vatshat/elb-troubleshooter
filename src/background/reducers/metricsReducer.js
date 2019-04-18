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
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15)
            ))(),
            "label": "MetricName",
            "metricData": [{
                "date": "1970-01-01T00:00:00Z",
                "value": 1
            }]
        }],
        selectedMetrics: {
            endtime: currentTime.toISOString(),
            startTime: new Date(currentTime.setDate(currentTime.getDate() - 12)).toISOString(),
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

const initialPredictionsState = {
<<<<<<< HEAD
    predictionStatus: "initial", 
    predictionProgress: {},
=======
    predictionStatus: "initial"
>>>>>>> 16ea7a26e932f16e7c75a319b1326015f62e1faa
}

const predictionsReducer = (state = initialPredictionsState, action) => {
    switch (action.type) {
        
        case 'PREDICTION_STATUS':
            return {
                ...state,
                predictionStatus: action.predictionStatus
            }
<<<<<<< HEAD

        case 'PREDICTION_START':
            return {
                ...state,
                predictionProgress: {
                    ...state.predictionProgress,
                    [action.id]: [],
                }
            }
            
        case 'PREDICTION_PROGRESS':
            return {
                ...state,
                predictionProgress: {
                    ...state.predictionProgress,
                    [action.predictionProgress.id]: 
                    [
                        ...state.predictionProgress[action.predictionProgress.id],
                        action.predictionProgress.message,
                    ],
                }
            }
=======
>>>>>>> 16ea7a26e932f16e7c75a319b1326015f62e1faa
            
        case 'PREDICTION_COMPLETED':
            return {
                ...state,
                predictedDatapoints: {
                    ...state.predictedDatapoints,
                    [action.predictedDatapoints.id]:action.predictedDatapoints.datapoints,
                }
            }
            
    default:
        return state;
    }
}

const metricManager = (state = {}, action) => {
    return {
        metricsReducer: metricsReducer(state.metricsReducer, action),
        credsReducer: credsReducer(state.credsReducer, action),
        predictionsReducer: predictionsReducer(state.predictionsReducer, action)
    }
}

export default metricManager;