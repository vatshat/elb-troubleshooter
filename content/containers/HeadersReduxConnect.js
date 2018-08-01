import { connect } from 'react-redux'
import HeadersTableContainer from './HeadersTableContainer'
import { pageChangeAction } from '../actions/pageAction'

const mapStateToProps = (state) => {
    let headersRowList = (headersList) => {
        return headersList.map((headerList) => {
            return headerList.metaHeaders;
        });
    }

    const { currentTablePage, sizePerTablePage } = state.headers.pagination;

    if (state.headers) {
        const headersLen = state.headers.actualHeaders.length;

        let currentIndex = currentTablePage < 1 ? (currentTablePage - 1) * sizePerTablePage : 1;
        
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
            sizePerPage: sizePerTablePage,
            page: currentTablePage
        };
    }
};

const mapDispatchToProps = dispatch => ({
    pageChange: (currentTableIndex, sizePerTablePage) => dispatch(pageChangeAction(currentTableIndex, sizePerTablePage))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HeadersTableContainer);