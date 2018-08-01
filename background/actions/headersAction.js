var headerId = 0;

function formatHeaders(headerRaw, id) {
    const headersFormatted = (({ id, requestId, initiator, timeStamp, type, url, statusCode, statusLine }) => (
        { id, requestId, initiator, timeStamp, type, url, statusCode, statusLine })
    )(headerRaw);

    headersFormatted.id = id;

    if (typeof headersFormatted.initiator === 'undefined') {
        headersFormatted.initiator = 'N/A'
    }

    if (typeof headersFormatted.statusCode === 'undefined') {
        headersFormatted.statusCode = 'N/A'
    }

    if (typeof headersFormatted.statusLine === 'undefined') {
        headersFormatted.statusLine = 'N/A'
    }

    return headersFormatted;
}

export const addHeaderAction = (actualHeaders) => ({
    type: 'ADD_HEADER',
    payload: formatHeaders(actualHeaders, headerId++),
})