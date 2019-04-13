
let parseXMLJSON = xmlJSON => xmlJSON
                                .GetMetricDataResponse
                                .GetMetricDataResult[0]
                                .MetricDataResults[0].member
    .map(m => {
        return {
            id: m["Id"][0],
            label: m["Label"][0],
            metricData: m["Timestamps"][0]["member"]
                        .map((timestamp, index) => {
                            return {
                                date: timestamp,
                                value: +m["Values"][0]["member"][index] // convert string to number
                            }
                        })
                        .sort((a, b) => a.date - b.date)
        }
    })

export const responseMetricsAction = xmlJSON => ({
    type: 'FETCH_METRICS_FULFILLED',
    response: parseXMLJSON(xmlJSON)
});

export const requestMetricsAction = () => ({
    type: 'FETCH_METRICS_PENDING'
})

export const testAction = () => ({
    type: 'TEST_ACTION'
})

export const errorMetricsAction = errorMessage => ({
    type: 'FETCH_METRICS_REJECTED',
    errorMessage: errorMessage
});

export const responseCredsAction = (creds) => ({
        type: 'STS_CREDS_FULFILLED',
        responseCreds: creds
});

export const requestCredsAction = () => ({
    type: 'STS_CREDS_PENDING'
});

export const errorCredsAction = errorMessage => ({
    type: 'STS_CREDS_REJECTED',
    errorMessage: errorMessage
});

export const predictionCompleteAction = predictedDatapoints => ({
    type: 'PREDICTION_COMPLETED',
    predictedDatapoints: predictedDatapoints
});

/* 
export const predictionErrorAction = errorMessage => ({
    type: 'PREDICTION_ERROR',
    errorMessage: errorMessage
});

export const predictionStartAction = () => ({
    type: 'PREDICTION_START',
});

export const predictionStartAction = () => ({
    type: 'PREDICTION_STOP',
});
 */