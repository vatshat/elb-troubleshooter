import React from 'react';

import { Router, Route, IndexRoute, hashHistory } from 'react-router-dom';

import Layout from './components/layout/Layout.js';
import Headers from './components/headers/Home.js';

export default(
    <Route path='/index.html' component={Layout}>
        <IndexRoute component={Headers}/>
    </Route>
)
