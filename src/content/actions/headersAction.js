export const captureToggleAction = (captureToggleProps) => ({
    type: 'CAPTURE_TOGGLE',
    captureToggle: captureToggleProps
});

export const addPreHeadersAction = (id, preHeaderCount) => ({
    type: 'ADD_PRE_HEADERS',
    id: id, 
    position: preHeaderCount, 
    display: true,
});

export const disablePreHeadersAction = (id) => ({
    type: 'DISABLE_PRE_HEADERS',
    id: id,
    display: false,
});

export const clearPreHeadersAction = () => ({
    type: 'CLEAR_PRE_HEADERS',
});