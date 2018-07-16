import React from 'react';
import { connect } from 'react-redux';
import PreHeader from './headers/PreHeader';

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.addEventListener('click', () => {
            this.props.dispatch({
                type: 'ADD_COUNT'
            });
        });

        /*
        window.history.replaceState({}, document.title, '/');

        fix the unmount of this with 
            https://stackoverflow.com/questions/39094138/reactjs-event-listener-beforeunload-added-but-not-removed
            https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Intercept_HTTP_requests
        */
    }    

    render() {

        if (this.props.preHeaders) {
            const { preHeaders } = this.props;
            
            const PreHeaderComponents = preHeaders.map((preHeader) => {    
                const id = preHeader.headers.timeStamp;
    
                return <PreHeader key={id} {...preHeader} />;
            });
            
            return (
                <div className="row">{PreHeaderComponents}</div>
            );
        }
        else { return ( <div /> ); }
    }
}

const mapStateToProps = (state) => {
    return {
        count: state.count,
        preHeaders: state.headers
    };
};

export default connect(mapStateToProps)(Home);
