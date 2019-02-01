import React from 'react';
import { connect } from 'react-redux';
import { PushSpinner } from "react-spinners-kit";

export class Home extends React.Component{
    changeURLHandler = () => {
        this.props.history.push('/')
    }

    render() {
        return (
            <div>
                <h1>Home</h1>
                
                <PushSpinner
                    size={30}
                    color="#686769"
                    loading={true}
                />

            </div>    
        )
    }
}

export const PageTemp = () => (
    <div>
        <h1>Temporary Page</h1>
    </div>
)

const mapStateToProps = (state) => {
    return {
        count: state.count
    };
};

export default connect(mapStateToProps)(Home);