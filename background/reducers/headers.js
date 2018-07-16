export default (state=[], action) => {
    switch (action.type) {
    case 'ADD_HEADER': return [...state, { 
        visible: false,
        headers: action.payload,         
    }];

    default: 
        return state;
    }
};