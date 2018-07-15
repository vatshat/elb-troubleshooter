import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'react-chrome-redux';
import { Router, browserHistory } from 'react-router'

import Routes from './Routes';

const proxyStore = new Store({
    portName: 'messaging'
});

render(
    <Provider store={proxyStore}>
        <Router history={browserHistory}>
            {Routes}
        </Router>
    </Provider>,
    document.getElementById('app')
);
