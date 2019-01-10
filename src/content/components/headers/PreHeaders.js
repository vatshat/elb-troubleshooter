import React from 'react';
import { connect } from 'react-redux';

const Headers = () => {
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


const PreHeader = (props) => {
    return (
        <pre style={{ wordWrap: 'normal' }} className="col-lg-4">
            {JSON.stringify(props, null, 2)}
        </pre>
    );
}

const mapStateToProps = (state) => {{ preHeadersStoreList: state.headers.actualHeaders }};

export default connect(mapStateToProps)(Headers);
