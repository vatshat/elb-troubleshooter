import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Headers, AccessLogs } from './Pages';
import Home from './Home';

import { connect } from 'react-redux';

import Nav from './layout/Nav';
import Footer from './layout/Footer';

class Main extends React.Component {
    render() {
        const containerStyle = {
            marginTop: '60px'
        };
    
        return(
            <main className="container" style={containerStyle}>
                <div className="row">
                    <div className="col-lg-12">
                        <Switch>
                            <Route exact path='/' component={Home} />
                            <Route exact path='/index.html' component={Home} />
                            <Route exact path='/headers' component={Headers}/>
                            <Route exact path='/access_logs' component={AccessLogs} />
                        </Switch>
                    </div>
                </div>
            </main>
        )

    }
}

class Layout extends React.Component {
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

export default Layout;
