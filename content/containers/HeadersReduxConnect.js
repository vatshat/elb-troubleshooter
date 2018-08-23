import { connect } from 'react-redux'
import HeadersTableContainer from './HeadersContainer'
import * as pageAction from '../actions/pageAction'

const mapStateToProps = (state) => {    
    if (state.headers) {    
        const toggleCapture = typeof state.headers.preHeaders.toggleCapture === 'undefined' ? false : state.headers.preHeaders.toggleCapture;

        return {
            headersRowList: state.headers.actualHeaders.map((headerList) => {
                let time = new Date(headerList.metaHeaders.timeStamp);
                headerList.metaHeaders.timeStamp = `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`;
                return headerList.metaHeaders;
            }),
            toggleCapture: toggleCapture,
            selectedHeaders: state.headers.preHeaders.selectedHeaders,
            preHeaderCount: state.headers.preHeaders.preHeaderCount,
        };        
    } else {
        return {
            headersRowList: [],
            toggleCapture: false,
            selectedHeaders: [],
        };
    }
};

const mapDispatchToProps = dispatch => ({
    captureToggleDispatch: (toggleCapture) => dispatch(pageAction.captureToggleAction(toggleCapture)),
    addPreHeadersDispatch: (id, preHeaderCount) => dispatch(pageAction.addPreHeadersAction(id, preHeaderCount)),
    disablePreHeadersDispatch: (id) => dispatch(pageAction.disablePreHeadersAction(id)),
    clearPreHeadersDispatch: () => dispatch(pageAction.clearPreHeadersAction())
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HeadersTableContainer);