import React from 'react';
import { connect } from 'react-redux';

class Home extends React.Component {    
    render() {
        
        return (            
            <div>
                <h1>Headers</h1>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        count: state.count,
        preHeadersStoreList: state.headers
    };
};

export default connect(mapStateToProps)(Home);
