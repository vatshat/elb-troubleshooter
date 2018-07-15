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
    
    openApp() {
        chrome.tabs.create({
            url: chrome.runtime.getURL('index.html')
        });
    }

    render() {
        return (
            <div>
                Click Count: {this.props.count}
                <button type='button' className='navbar-toggle' onClick={this.openApp.bind(this)} />
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
