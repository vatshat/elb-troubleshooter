import { connect } from 'react-redux'
import HeadersTableContainer from './TempHeadersContainer'
import * as pageAction from '../actions/pageAction'

const mapStateToProps = (state) => {
    let headersRowList = (headersList) => {
        return headersList.map((headerList) => {
            headerList.metaHeaders.timeStamp = new Date(headerList.metaHeaders.timeStamp).toLocaleString();
            return headerList.metaHeaders;
        });
    }
    
    if (state.headers) {    
        const toggleCapture = typeof state.headers.toggleCapture === 'undefined' ? false : state.headers.toggleCapture;

        return {
            headersRowList: headersRowList(state.headers.actualHeaders),
            toggleCapture: toggleCapture,
        };        
    } else {
        return {
            headersRowList: [],
            toggleCapture: false,
        };
    }
};

const mapDispatchToProps = dispatch => ({
    captureToggleDispatch: (toggleCapture) => dispatch(pageAction.captureToggleAction(toggleCapture))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HeadersTableContainer);