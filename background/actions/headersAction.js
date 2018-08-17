var headerId = 0;

function headersFormat(headers, id, type) {

    headers.id = id;
    headers.headerType = type;

    if (typeof headers.initiator === 'undefined') {
        headers.initiator = 'N/A'
    }

    if (typeof headers.statusCode === 'undefined') {
        headers.statusCode = 'N/A'
    }

    if (typeof headers.statusLine === 'undefined') {
        headers.statusLine = 'N/A'
    }

    return headers;
}

function formatRequestHeaders(headerRaw, id) {
    const headersFormatted = (({ id, requestId, initiator, timeStamp, type, url, statusCode, statusLine, requestHeaders }) => (
        { id, requestId, initiator, timeStamp, type, url, statusCode, statusLine, requestHeaders })
    )(headerRaw);

    headersFormat(headersFormatted, id, 'request');
    
    return headersFormatted;
}

export const addRequestHeaderAction = (actualHeaders) => ({
    type: 'ADD_REQUEST_HEADER',
    payload: formatRequestHeaders(actualHeaders, headerId++),
})

function formatResponseHeaders(headerRaw, id) {
    const headersFormatted = (({ id, requestId, initiator, timeStamp, type, url, statusCode, statusLine, responseHeaders }) => (
        { id, requestId, initiator, timeStamp, type, url, statusCode, statusLine, responseHeaders })
    )(headerRaw);

    headersFormat(headersFormatted, id, 'response');
    
    return headersFormatted;
}

export const addResponseHeaderAction = (actualHeaders) => ({
    type: 'ADD_RESPONSE_HEADER',
    payload: formatResponseHeaders(actualHeaders, headerId++),
})