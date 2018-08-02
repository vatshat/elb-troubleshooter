import React from 'react';

export class Home extends React.Component{
    constructor(props) {
        super(props);
        this.changeURLHandler = this.changeURLHandler.bind(this);
    }

    changeURLHandler() {
        this.props.history.push('/')
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