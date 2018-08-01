
// https://flaviocopes.com/redux/

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

const headerManager = (state = {}, action) => {
    return {
        actualHeaders: addHeaderReducer(state.actualHeaders, action),
        pagination: pageChangeReducer(state.pagination, action),
    }
}

export default headerManager;
