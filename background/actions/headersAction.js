var headerId = 0;

function headersFormat(headers, id) {

    headers.id = id;

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

function formatHeaders(headerRaw, id) {
    const headersFormatted = (({ id, requestId, initiator, timeStamp, type, url, statusCode, statusLine, requestHeaders }) => (
        { id, requestId, initiator, timeStamp, type, url, statusCode, statusLine, requestHeaders })
    )(headerRaw);

    headersFormat(headersFormatted, id);
    
    return headersFormatted;
}

export const addHeaderAction = (actualHeaders) => ({
    type: 'ADD_HEADER',
    payload: formatHeaders(actualHeaders, headerId++),
})