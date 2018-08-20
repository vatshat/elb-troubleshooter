
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

const initialState = {
    toggleCapture: false,
    selectedHeaders: [],
    preHeaderCount: 0,
}

const preHeadersReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'CAPTURE_TOGGLE': {        
        return { 
            ...state,
            toggleCapture: action.captureToggle 
        }
    }

    case 'DISABLE_PRE_HEADERS': {
        const newSelectedHeaders = state.selectedHeaders.map((e) => { 
            if (e.id === action.id) {
                e = {
                    ...e,
                    display: action.display,
                }
            }

            return e;
        });

        return {
            ...state,
            selectedHeaders: newSelectedHeaders
        }        
    }

    case 'ADD_PRE_HEADERS': {        
        let idAlreadyExists = false;
        // // https://stackoverflow.com/questions/35789221/redux-reducer-check-if-value-exists-in-state-array-and-update-state

        const newSelectedHeaders = state.selectedHeaders.map((e) => { 
            if (e.id === action.id) {
                // https://medium.com/front-end-hacking/immutability-in-array-of-objects-using-map-method-dd61584c7188#a6a6

                idAlreadyExists = true;
                e = {
                    ...e,
                    display: action.display,
                    position: action.position
                }
            }

            return e;
        });

        if (idAlreadyExists) {
            return {
                ...state,
                selectedHeaders: newSelectedHeaders
            }
        } 
        else {                        
            return {
                ...state,
                preHeaderCount: state.preHeaderCount + 1,
                selectedHeaders: state.selectedHeaders.concat([{
                    id: action.id,
                    position: action.position,
                    display: action.display
                }])
            }
        }
    }
    default:
        return state;
    }
}

const headerManager = (state = {}, action) => {
    return {
        actualHeaders: addHeaderReducer(state.actualHeaders, action),
        preHeaders: preHeadersReducer(state.preHeaders, action),
    }
}

export default headerManager;
