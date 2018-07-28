import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AccessLogs } from './Pages';
import Headers from './headers/PreHeaders';
import TempPage from './tempPage/TempPage';

import Home from './Home';

import  Nav from './layout/Nav';
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
                            <Route exact path='/temp_page' component={TempPage} />
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
