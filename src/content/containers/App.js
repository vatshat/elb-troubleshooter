import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Home, Metrics } from '../components/tempPage/StaticPages';
import { PageTemp } from '../components/tempPage/TempPages';
import Headers from './HeadersReduxConnect';

import Nav from '../components/layout/Nav';
import Footer from '../components/layout/Footer';

class Main extends React.Component {
    render() {
        const containerStyle = {
            marginTop: '60px',
            textAlign: 'left'
        };
    
        return(
            <main style={containerStyle}>
                <div className="row">
                    <div className="col-lg-12">
                        <Switch>
                            <Route exact path='/headers' component={Headers}/>
                            <Route exact path='/access_logs' component={Metrics} />
                            <Route exact path='/temp_page' component={PageTemp} />
                            <Route path='/' component={Home} />
                        </Switch>
                    </div>
                </div>
                { /* http://blog.instance-factory.com/?p=1165 */ }
                <div 
                    id="footer-filler"
                    className="navbar navbar-default" 
                    style={{ 
                        background:'white',
                        borderColor: 'white',
                        boxShadow:'none',
                    }}
                />
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
            <div style={{width:'90%'}} >
                <Nav />
                <Main />
                <Footer />
            </div>
        )
    }
}

export default Layout;
