import { combineReducers } from 'redux';

import count from './countReducer';
import headers from './headersReducer';

export default combineReducers({
    count,
    headers
});
