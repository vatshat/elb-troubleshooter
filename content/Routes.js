import React from 'react';
//import Route from 'react-router/lib/Route';
//import IndexRoute from 'react-router/lib/IndexRoute';

import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import Layout from './components/layout/Layout.js';
import Headers from './components/headers/Headers.js';

export default(
    <Route path='/index.html' component={Layout}>
        <IndexRoute component={Headers}/>
    </Route>
)
