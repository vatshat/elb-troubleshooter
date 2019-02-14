import { combineReducers } from 'redux';

import count from './countReducer';
import headers from './headersReducer';
import metrics from './metricsReducer';

export default combineReducers({
    count,
    headers,
    metrics,
});
