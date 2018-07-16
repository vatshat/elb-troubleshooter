import { wrapStore } from 'react-chrome-redux';
import configureStore from './configureStore';

const store = configureStore();

wrapStore(store, {
    portName: 'messaging'
});

chrome.webRequest.onBeforeRequest.addListener(
    (requestDetails) => {
        store.dispatch({
            type: 'ADD_HEADER',
            payload: requestDetails
        });
    }, {
        urls: ['<all_urls>']
    }
);