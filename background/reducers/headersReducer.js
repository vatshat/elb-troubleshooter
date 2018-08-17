
/* 
    Alternative to YouTube version
    
    a reducer for every part of the state

    https://flaviocopes.com/redux

*/

const addHeaderReducer =  (state=[], action) => {
    switch (action.type) {
    case 'ADD_REQUEST_HEADER': {        
        return state.concat([{ metaHeaders: action.payload }])        
    }
    case 'ADD_RESPONSE_HEADER': {        
        return state.concat([{ metaHeaders: action.payload }])        
    }
    default:
        return state;
    }
};

const captureToggleReducer = (state=false, action) => {
    if (action.type === 'CAPTURE_TOGGLE') {
        return action.captureToggle
    } else {
        return state
    }
}

const headerManager = (state = {}, action) => {
    return {
        actualHeaders: addHeaderReducer(state.actualHeaders, action),
        toggleCapture: captureToggleReducer(state.toggleCapture, action),
    }
}

export default headerManager;
