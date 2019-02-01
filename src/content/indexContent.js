import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'react-chrome-redux';
import { HashRouter } from 'react-router-dom'

import Layout from './App.js';

import './static/css/index-content.scss';

import './static/css/index.min.css';
// import './static/css/bootstrap.min.css';
import './static/css/react-bootstrap-table-all.min.css';
import './static/icon.png'

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