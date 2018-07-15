import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class Layout extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        document.addEventListener('click', () => {
            this.props.dispatch({
                type: 'ADD_COUNT'
            });
        });
    }
    
    toggleCollapse() {
        chrome.tabs.create({
            url: chrome.runtime.getURL('popup.html')
        });
    }
    
    render() {
        console.log(this.props);
        return (
            <div className='App'>
                Hello World
                Click Count: {this.props.count}              
                <button type='button' className='navbar-toggle' onClick={this.toggleCollapse.bind(this)} />
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
