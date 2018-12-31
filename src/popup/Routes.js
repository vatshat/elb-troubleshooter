import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';

import Layout from './components/Layout.js';
import Test from './components/Base.js';

export default(
    <Route path='/popup.html' component={Layout}>
        <IndexRoute component={Test}/>
    </Route>
)
