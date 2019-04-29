export const responseMetricsAction = response => ({
    type: 'FETCH_METRICS_FULFILLED',
    response: response, 
});

export const requestMetricsAction = () => ({
    type: 'FETCH_METRICS_PENDING'
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

export const predictionCompleteAction = datapointsUpdate => ({
    type: 'PREDICTION_COMPLETED',
    datapointsUpdate: datapointsUpdate,
});

export const predictionStatusAction = predictionStatus => ({
    type: 'PREDICTION_STATUS',
    predictionStatus: predictionStatus
});

export const predictionInitializeAction = id => ({
    type: 'PREDICTION_INITIALIZE',
    id: id
});

export const predictionProgressAction = predictionProgress => ({
    type: 'PREDICTION_PROGRESS',
    predictionProgress: predictionProgress
});