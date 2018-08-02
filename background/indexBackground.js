import { wrapStore } from 'react-chrome-redux';
import configureStore from './configureStore';
import { addHeaderAction } from './actions/headersAction';

const store = configureStore();

wrapStore(store, {
    portName: 'messaging'
});

/*
let pattern = chrome.runtime.getURL('/');

chrome.webRequest.onBeforeRequest.addListener(
    (requestDetails) => {
        //alert(pattern.slice(0, -1) + 'popup.html')
        
        if (requestDetails.url === pattern.slice(0, -1) + 'popup.html') 
        {
            return {
                redirectUrl: chrome.runtime.getURL('popup.html')
            }
            
        } else { 
            return {
                redirectUrl: chrome.runtime.getURL('index.html')
            }
        }
    },
    { urls:[pattern, pattern + '#'] },
    ['blocking']
);
*/
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