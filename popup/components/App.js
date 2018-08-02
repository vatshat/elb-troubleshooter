import React, { Component } from 'react';
import { connect } from 'react-redux';

class App extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.addEventListener('click', () => {
            this.props.dispatch({
                type: 'ADD_COUNT'
            });
        });
    }
    
    // https://stackoverflow.com/questions/35834622/chrome-extensions-creating-a-html-page-accessible-by-clicking-browser-action
    clickHandler() {       
        
        chrome.tabs.create({
            url: chrome.runtime.getURL('/')
        });
    }

    render() {
        return (
            <div>
                Click Count: {this.props.count}
                <button type='button' className='navbar-toggle' onClick={this.clickHandler.bind(this)}>
                    Open App
                </button>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        count: state.count
    };
};

export default connect(mapStateToProps)(App);
