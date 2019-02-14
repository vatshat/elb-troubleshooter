const initialState = ({
    metricsStatus: "initial",
    metricWidgets: [{
        "Id": (() => (
            Math
            .random()
            .toString(36)
            .substring(2, 15) +
            Math.random().toString(36).substring(2, 15)
        ))(),
        "Label": "Metric",
        "metricData": [{
            "date": "1970-01-01T00:00:00.000Z",
            "value": 1
        }]
    }],
})

export const metricsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_METRICS_PENDING':
            return {
                ...initialState,
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
        metricsReducer: metricsReducer(state.metricsWidget, action),
    }
}

export default metricManager;