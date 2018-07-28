import React from 'react';
import { connect } from 'react-redux';

class Headers extends React.Component {

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

        if (this.props.preHeadersStoreList) {
            const { preHeadersStoreList } = this.props;
            
            const preHeadersList = preHeadersStoreList.slice(0, 10);

            const PreHeaderComponents = preHeadersList.map((preHeader, index) => {                    

                //const id = preHeader.headers.timeStamp; //Date.now()
                
                const id = index

                return <PreHeader key={id}  {...preHeader } />;
            });
            
            return (
                <div className="row">{PreHeaderComponents}</div>
            );
        }
        else { return ( <div /> ); }
    }
}

const preStyle = {
    wordWrap: 'normal'
};

class PreHeader extends React.Component {
    render() {
        return (
            <pre style={preStyle} className="col-lg-4">
                {JSON.stringify(this.props, null, 2)}
            </pre>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        preHeadersStoreList: state.headers
    };
};

export default connect(mapStateToProps)(Headers);
