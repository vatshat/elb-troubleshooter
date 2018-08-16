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
        const sizePerTablePage = typeof state.headers.currentPageSize === 'undefined' ? 10 : state.headers.currentPageSize;
        const currentTablePage = typeof state.headers.currentPageStore === 'undefined' ? 1 : state.headers.currentPageStore;
        const headersLen = state.headers.actualHeaders.length;
        
        const toggleCapture = typeof state.headers.toggleCapture === 'undefined' ? false : state.headers.toggleCapture;

        let currentIndex = currentTablePage < 1 ? 1 : (currentTablePage - 1) * sizePerTablePage;
        
        if ( headersLen > 10) {
            // https://stackoverflow.com/questions/17781472/how-to-get-a-subset-of-a-javascript-objects-properties
            
            return {                
                headersRowList: headersRowList(
                    state.headers.actualHeaders.slice(currentIndex, currentIndex + sizePerTablePage)
                ),
                headersLength: headersLen,
                sizePerPage: sizePerTablePage,
                page: currentTablePage,
                toggleCapture: toggleCapture,
            };
        } else {
            return {
                headersRowList: state.headers.actualHeaders,
                headersLength: headersLen,
                sizePerPage: sizePerTablePage,
                page: currentTablePage,
                toggleCapture: toggleCapture,
            };
        }
    } else {
        return {
            headersRowList: [],
            headersLength: 0,
            sizePerPage: 10,
            page: 1,
            toggleCapture: false,
        };
    }
};

const mapDispatchToProps = dispatch => ({
    pageTableIndexDispatch: (currentTableIndex) => dispatch(pageAction.pageTempChangeAction(currentTableIndex)),
    pageSizeDispatch: (sizePerTablePage) => dispatch(pageAction.pageSizeTempChangeAction(sizePerTablePage)),
    captureToggleDispatch: (toggleCapture) => dispatch(pageAction.captureToggleAction(toggleCapture))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HeadersTableContainer);