import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'react-chrome-redux';
import { BrowserRouter } from 'react-router-dom'

import Layout from './components/App.js';

const proxyStore = new Store({
    portName: 'messaging'
});

render(
    <Provider store={proxyStore}>
        <BrowserRouter>            
            <Layout />
        </BrowserRouter>
    </Provider>,
    document.getElementById('app')
);