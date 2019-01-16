import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'react-chrome-redux';
import { HashRouter } from 'react-router-dom'

import Layout from './App.js';

const proxyStore = new Store({
    portName: 'messaging'
});

render(
    <Provider store={proxyStore}>
        <HashRouter>            
            <Layout />
        </HashRouter>
    </Provider>,
    document.getElementById('app')
);