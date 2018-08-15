import React from 'react';
import { connect } from 'react-redux';

export class Home extends React.Component{
    constructor(props) {
        super(props);
        this.changeURLHandler = this.changeURLHandler.bind(this);
    }

    changeURLHandler() {
        this.props.history.push('/')
    }

    componentDidMount() {
        document.addEventListener('click', () => {
            this.props.dispatch({
                type: 'ADD_COUNT'
            });
        });
    }

    render() {
        return (
            <div onClick={ this.changeURLHandler } onLoad={ this.changeURLHandler }>
                <h1>Headers</h1>
            </div>
    
        )
    }
}

export const AccessLogs = () => (
    <div>
        <h1>Access Logs</h1>
    </div>
)

const mapStateToProps = (state) => {
    return {
        count: state.count
    };
};

export default connect(mapStateToProps)(Home);