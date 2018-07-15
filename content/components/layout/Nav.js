import React from 'react';
import { IndexLink, Link } from 'react-router';
//https://webpack.js.org/concepts/loaders/
import styles from './Nav.css';

export default class Nav extends React.Component {
    constructor() {
        super()
    }

    render() {
        const { location } = this.props;
        const featuredClass = location.pathname === '/' ? 'active' : '';
        const headersClass = location.pathname.match(/^\/headers/) ? 'active' : '';
        const settingsClass = location.pathname.match(/^\/settings/) ? 'active' : '';
        
        /* 
        https://stackoverflow.com/questions/28365233/inline-css-styles-in-react-how-to-implement-ahover
            alternative to this is simply stick to css using... :local(.li:hover){ background: yellow; }
        */     

        return (
            <nav className={'navbar navbar-inverse navbar-fixed-top bg-dark navbar-dark ' + styles.nav_bar}  role='navigation' >
                <div className='container'>        
                    <a className={'navbar-brand ' + styles.nav_a_img} href='#'>
                        <img className={styles.nav_img} src='static/aws.jpg' alt='logo' />
                    </a>
                    <div className='navbar-header'>
                        <button type='button' className='navbar-toggle'>
                            <span className='sr-only'>Toggle navigation</span>
                            <span className='icon-bar'></span>
                            <span className='icon-bar'></span>
                            <span className='icon-bar'></span>
                        </button>
                    </div>
                    <div className={'navbar-collapse'} id='bs-example-navbar-collapse-1'>
                        <ul className='nav navbar-nav'>
                            <li className={featuredClass}>
                                <IndexLink to='/'activeStyle={{ background: '#151d27' }}>
                                Todos
                                </IndexLink>
                            </li>
                            <li className={headersClass}>
                                <Link to='headers'>
                                Headers
                                </Link>
                            </li>
                            <li className={settingsClass}>
                                <Link to='settings'>
                                Settings
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}
