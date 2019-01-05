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

    render() {
        return (
            <div>
                <h1>Home</h1>
            </div>    
        )
    }
}

export const Metrics = () => (
    <div>
        <h1>Metrics</h1>
    </div>
)

const mapStateToProps = (state) => {
    return {
        count: state.count
    };
};

export default connect(mapStateToProps)(Home);