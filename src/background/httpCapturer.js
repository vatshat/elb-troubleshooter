import { addRequestHeaderAction, addResponseHeaderAction } from './actions/headersAction';
import store from'./indexBackground'
import ChromeWebRequestValidator from './HeaderValidator'

export default function httpCapturer() {
    /*
        // trying fix the url and redirection when trying to incorporate hash router to React app
        
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
   
    let headerValidate = new ChromeWebRequestValidator();

    function requestListenerCallback(headerDetails) { 
        if (headerValidate.validate(headerDetails)) {
            store.dispatch(
                addRequestHeaderAction(headerDetails)
            );
        }
        else {
            store.dispatch(
                headerValidate.errorRequest(headerDetails, true)
            )
        }
    }
    
    function responseListenerCallback(headerDetails) {

        if (headerValidate.validate(headerDetails)) {
            store.dispatch(
                addResponseHeaderAction(headerDetails)
            );
        } else {
            store.dispatch(
                headerValidate.errorRequest(headerDetails, false)
            )
        }
    }

    store.subscribe(() => {
        if(store.getState().headers.preHeaders.toggleCapture === true) {

            if (chrome.webRequest.onBeforeSendHeaders.hasListener(requestListenerCallback) === false) {
                chrome.webRequest.onBeforeSendHeaders.addListener(
                    requestListenerCallback, {
                        urls: ['<all_urls>']
                    }, ['requestHeaders']
                );
            }

            if (chrome.webRequest.onHeadersReceived.hasListener(responseListenerCallback) === false) {
                chrome.webRequest.onHeadersReceived.addListener(
                    responseListenerCallback, {
                        urls: ['<all_urls>']
                    }, ['responseHeaders']
        
                )
            }        
        } else {
            if (chrome.webRequest.onBeforeSendHeaders.hasListener(requestListenerCallback) === true) {
                chrome.webRequest.onBeforeSendHeaders.removeListener(requestListenerCallback);
            }
            
            if (chrome.webRequest.onHeadersReceived.hasListener(responseListenerCallback) === true) {
                chrome.webRequest.onHeadersReceived.removeListener(responseListenerCallback);
            }
        }

    })
}