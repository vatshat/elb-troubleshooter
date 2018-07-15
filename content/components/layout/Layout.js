import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Nav from './Nav';
import Footer from './Footer';

class Layout extends Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        
        const { location } = this.props;
        const containerStyle = {
            marginTop: '60px'
        };

        return (
            <div>

                <Nav location={location} />

                <div className='container' style={containerStyle}>
                    <div className='row'>
                        <div className='col-lg-12'>

                            {this.props.children}

                        </div>
                    </div>
                </div>

                <Footer/>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        count: state.count
    };
};

export default connect(mapStateToProps)(Layout);
