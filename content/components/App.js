import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Home, Page1, Page2, Page3 } from './headers/Pages';

import { connect } from 'react-redux';

import Nav from './layout/Nav';
import Footer from './layout/Footer';

const Main = () => (
    <main>
        <Switch>
            <Route exact path='/index.html' component={Home} />
            <Route exact path='/1' component={Page1}/>
            <Route exact path='/2' component={Page2} />
            <Route exact path='/3' component={Page3} />
        </Switch>
    </main>
)

class App extends React.Component {
    constructor(){
        super()
    }
    render() {
        const { location } = this.props;

        return (
            <div>
                <Nav />
                <Main />
                <Footer />
            </div>
        )
    }
}

export default App;
