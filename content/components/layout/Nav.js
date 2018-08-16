import React from 'react';
import { Link, NavLink } from 'react-router-dom';
//https://webpack.js.org/concepts/loaders/
import styles from './Nav.css';

class Header extends React.Component { 
    constructor(props) {
        super(props);
    }
    
    render () {
        /*
        https://stackoverflow.com/questions/28365233/inline-css-styles-in-react-how-to-implement-ahover
            alternative to this is simply stick to css using... :local(.li:hover){ background: yellow; }
        */
        return (
            <nav className={'navbar navbar-inverse navbar-fixed-top bg-dark navbar-dark ' + styles.nav_bar}  role='navigation' >            
                <div style={{width:'90%'}}>
                    <Link className={'navbar-brand ' + styles.nav_a_img} to='/index.html'>
                        <img className={styles.nav_img} src='img/aws.jpg' alt='logo' />
                    </Link>

                    <div className='navbar-header'>
                        <button type='button' className='navbar-toggle'>
                            <span className='sr-only'>Toggle navigation</span>
                            <span className='icon-bar'></span>
                            <span className='icon-bar'></span>
                            <span className='icon-bar'></span>
                        </button>
                    </div>
                    <div className="collapse navbar-collapse">
                        <ul className="nav navbar-nav">                            
                            <li>
                                <NavLink id="nav1" to='/'activeStyle={{ background: '#151d27' }}>
                                    Home
                                </NavLink>
                            </li>                           
                            <li>
                                <NavLink id="nav2" to='/headers'activeStyle={{ background: '#151d27' }}>
                                    Headers
                                </NavLink>
                            </li>                           
                            <li>
                                <NavLink id="nav3" to='/access_logs' activeStyle={{ background: '#151d27' }}>
                                    Access Logs
                                </NavLink>
                            </li>                           
                            <li>
                                <NavLink id="nav4" to='/temp_page' activeStyle={{ background: '#151d27' }}>
                                    Temp page
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}

export default Header