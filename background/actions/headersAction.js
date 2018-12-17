var headerId = 0;

function headersFormat(headers, id, type) {

    // https://esdiscuss.org/topic/conditional-object-properties

    return {
        ...headers, 
        id,
        headerType : type,
        ...(headers.initiator ? null: {initiator: "N/A"}),
        ...(headers.statusCode ? null: {statusCode: "N/A"}),
        ...(headers.statusLine ? null: {statusLine: "N/A"})
    }
}

function formatRequestHeaders(headerRaw, id) {
    // headersFormatted is an IIFE to remove unnecessary keys
    // refactor these functions by removing the confusing IIFE and just use conditional refactoring like in "headersFormat" function
    
    let headersFormatted = (({ id, requestId, initiator, timeStamp, type, url, statusCode, statusLine, requestHeaders }) => (
        { id, requestId, initiator, timeStamp, type, url, statusCode, statusLine, requestHeaders })
    )(headerRaw);

    return headersFormat(headersFormatted, id, 'request');    
}

export const addRequestHeaderAction = (actualHeaders) => ({
    type: 'ADD_REQUEST_HEADER',
    payload: formatRequestHeaders(actualHeaders, headerId++),
})

function formatResponseHeaders(headerRaw, id) {
    let headersFormatted = (({ id, requestId, initiator, timeStamp, type, url, statusCode, statusLine, responseHeaders }) => (
        { id, requestId, initiator, timeStamp, type, url, statusCode, statusLine, responseHeaders })
    )(headerRaw);
    
    return headersFormat(headersFormatted, id, 'response');    
}

export const addResponseHeaderAction = (actualHeaders) => ({
    type: 'ADD_RESPONSE_HEADER',
    payload: formatResponseHeaders(actualHeaders, headerId++),
})