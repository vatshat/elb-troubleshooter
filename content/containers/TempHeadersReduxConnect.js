import { connect } from 'react-redux'
import HeadersTableContainer from './TempHeadersContainer'
import { pageTempChangeAction,  pageSizeTempChangeAction } from '../actions/pageAction'

const mapStateToProps = (state) => {
    let headersRowList = (headersList) => {
        return headersList.map((headerList) => {
            return headerList.metaHeaders;
        });
    }
    
    if (state.headers) {    
        const sizePerTablePage = state.headers.currentPageSize;
        const currentTablePage = state.headers.currentPageStore;
        const headersLen = state.headers.actualHeaders.length;

        let currentIndex = currentTablePage < 1 ? 1 : (currentTablePage - 1) * sizePerTablePage;
        
        if ( headersLen > 10) {
            // https://stackoverflow.com/questions/17781472/how-to-get-a-subset-of-a-javascript-objects-properties
            
            return {                
                headersRowList: headersRowList(
                    state.headers.actualHeaders.slice(currentIndex, currentIndex + sizePerTablePage)
                ),
                headersLength: headersLen,
                sizePerPage: sizePerTablePage,
                page: currentTablePage
            };
        } else {
            return {
                headersRowList: state.headers.actualHeaders,
                headersLength: headersLen,
                sizePerPage: sizePerTablePage,
                page: currentTablePage
            };
        }
    } else {
        return {
            headersRowList: [],
            headersLength: 0,
            sizePerPage: 10,
            page: 1
        };
    }
};

const mapDispatchToProps = dispatch => ({
    pageTableIndex: (currentTableIndex) => dispatch(pageTempChangeAction(currentTableIndex)),
    pageSize: (sizePerTablePage) => dispatch(pageSizeTempChangeAction(sizePerTablePage))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HeadersTableContainer);