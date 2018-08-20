import { connect } from 'react-redux'
import HeadersTableContainer from './HeadersContainer'
import * as pageAction from '../actions/pageAction'

const mapStateToProps = (state) => {
    let headersRowList = (headersList) => {
        return headersList.map((headerList) => {
            headerList.metaHeaders.timeStamp = new Date(headerList.metaHeaders.timeStamp).toLocaleString();
            return headerList.metaHeaders;
        });
    }
    
    if (state.headers) {    
        const toggleCapture = typeof state.headers.preHeaders.toggleCapture === 'undefined' ? false : state.headers.preHeaders.toggleCapture;

        return {
            headersRowList: headersRowList(state.headers.actualHeaders),
            toggleCapture: toggleCapture,
            selectedHeaders: state.headers.preHeaders.selectedHeaders,
            preHeaderCount: state.headers.preHeaders.preHeaderCount,
        };        
    } else {
        return {
            headersRowList: [],
            toggleCapture: false,
        };
    }
};

const mapDispatchToProps = dispatch => ({
    captureToggleDispatch: (toggleCapture) => dispatch(pageAction.captureToggleAction(toggleCapture)),
    addPreHeadersDispatch: (id, preHeaderCount) => dispatch(pageAction.addPreHeadersAction(id, preHeaderCount)),
    disablePreHeadersDispatch: (id) => dispatch(pageAction.disablePreHeadersAction(id))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HeadersTableContainer);