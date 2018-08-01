import { wrapStore } from 'react-chrome-redux';
import configureStore from './configureStore';
import { addHeaderAction } from './actions/headersAction';

const store = configureStore();

wrapStore(store, {
    portName: 'messaging'
});

chrome.webRequest.onBeforeSendHeaders.addListener(
    (requestDetails) => {
        store.dispatch(
            addHeaderAction(requestDetails)
        );
    }, 
    { urls: ['<all_urls>'] },
    ['requestHeaders']
);

chrome.webRequest.onHeadersReceived.addListener(
    (responseDetails) => {
        store.dispatch(
            addHeaderAction(responseDetails)
        );
    }, {
        urls: ['<all_urls>']
    }, ['responseHeaders']

)