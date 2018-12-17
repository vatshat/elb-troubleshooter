import { wrapStore } from 'react-chrome-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from './reducers/rootReducer';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import httpCapturer from './httpCapturer'

const logger = createLogger({
    level: 'info',
    collapsed: true
})

const middleware = [thunk, logger];

function configureStore(initialState) {
    return createStore(
        rootReducer,
        initialState,
        compose(
            applyMiddleware(...middleware),
            window.devToolsExtension ? window.devToolsExtension() : f => f
        )
    );
}

const store = configureStore();

wrapStore(store, {
    portName: 'messaging'
});

export default store;

httpCapturer();