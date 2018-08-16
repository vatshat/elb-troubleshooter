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

function headerListenerCallback(headerDetails) { 
    store.dispatch(
        addHeaderAction(headerDetails)
    );
}

store.subscribe(() => {
    if(store.getState().headers.toggleCapture === true) {

        if (chrome.webRequest.onBeforeSendHeaders.hasListener(headerListenerCallback) === false) {
            chrome.webRequest.onBeforeSendHeaders.addListener(
                headerListenerCallback, {
                    urls: ['<all_urls>']
                }, ['requestHeaders']
            );
        }

        if (chrome.webRequest.onHeadersReceived.hasListener(headerListenerCallback) === false) {
            chrome.webRequest.onHeadersReceived.addListener(
                headerListenerCallback, {
                    urls: ['<all_urls>']
                }, ['responseHeaders']
    
            )
        }        
    } else {
        if (chrome.webRequest.onBeforeSendHeaders.hasListener(headerListenerCallback) === true) {
            chrome.webRequest.onBeforeSendHeaders.removeListener(headerListenerCallback);
        }

        
        if (chrome.webRequest.onHeadersReceived.hasListener(headerListenerCallback) === true) {
            chrome.webRequest.onHeadersReceived.removeListener(headerListenerCallback);
        }
    }

})