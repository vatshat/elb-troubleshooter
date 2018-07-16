import { combineReducers } from 'redux';

import count from './count';
import headers from './headers';

export default combineReducers({
    count,
    headers
});
