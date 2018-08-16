
/* 
    Alternative to YouTube version
    
    a reducer for every part of the state

    https://flaviocopes.com/redux

*/

const addHeaderReducer =  (state=[], action) => {
    switch (action.type) {
    case 'ADD_HEADER': {        
        return state.concat([{ metaHeaders: action.payload }])        
    }
    default:
        return state;
    }
};

const initState = { 
    currentTablePage: 1,
    sizePerTablePage: 10
}

const pageChangeReducer = (state=initState, action) => {
    switch (action.type) {
    case 'PAGE_CHANGE': {
        return {...state,
            currentTablePage: action.currentTablePage,
            sizePerTablePage: action.sizePerTablePage,
        }
    }
    default:
        return state;
    }
}

const pageTempChangeReducer = (state = 1, action) => {
    if (action.type === 'TEMP_PAGE_CHANGE') {
        return action.currentTempTablePage
    } else {
        return state
    }
}

const pageSizeTempChangeRedcuer = (state = 10, action) => {
    if (action.type === 'TEMP_PAGE_SIZE_CHANGE') {
        return action.sizePerTempTablePage
    } else {
        return state
    }
}

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
        pagination: pageChangeReducer(state.pagination, action),
        currentPageStore: pageTempChangeReducer(state.currentPageStore, action),
        currentPageSize: pageSizeTempChangeRedcuer(state.currentPageSize, action),
        toggleCapture: captureToggleReducer(state.toggleCapture, action),
    }
}

export default headerManager;
