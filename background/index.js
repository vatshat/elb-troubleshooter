import { wrapStore } from 'react-chrome-redux';
import configureStore from './configureStore';

const store = configureStore();

wrapStore(store, {
    portName: 'messaging'
});

chrome.webRequest.onBeforeSendHeaders.addListener(
    (requestDetails) => {
        store.dispatch({
            type: 'ADD_HEADER',
            payload: requestDetails
        });
    }, 
    { urls: ['<all_urls>'] },
    ['requestHeaders']
);

chrome.webRequest.onHeadersReceived.addListener(
    (responseDetails) => {
        store.dispatch({
            type: 'ADD_HEADER',
            payload: responseDetails
        });
    }, {
        urls: ['<all_urls>']
    }, ['responseHeaders']

)