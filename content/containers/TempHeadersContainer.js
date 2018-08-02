import React from 'react';
import { RemotePaging, TitleComponent } from '../components/tempPage/TempHeadersComponent';

export default class TempPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            totalDataSize: this.props.headersLength,
            sizePerPage: this.props.sizePerPage,
            currentPage: this.props.page
        };
    }

    onPageChange(page, sizePerPage) {
        window.pageTableIndex(page)
    }

    onSizePerPageList(sizePerPage) {
        window.pageSize(sizePerPage);
    }

    handleTableRefresh() {
        this.setState(() => ({
            totalDataSize: this.props.headersLength
        }));
    }

    render() {
        window.pageTableIndex = this.props.pageTableIndex;
        window.pageSize = this.props.pageSize;

        return ( 
            <div>            
                <TitleComponent 
                    handleTableRefresh={ this.handleTableRefresh.bind(this) }
                />

                <RemotePaging 
                    data={ this.props.headersRowList }
                    totalDataSize = { this.props.headersLength }
                    sizePerPage = { this.props.sizePerPage }
                    currentPage = { this.props.page }
                    loading = { this.state.loading }
                    onPageChange = { this.onPageChange.bind(this) }
                    onSizePerPageList = { this.onSizePerPageList.bind(this) }                 
                />
            </div>
        );
    }
}
