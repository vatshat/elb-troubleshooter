import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import PropTypes from 'prop-types';

export class TitleComponent extends React.Component {
    
    render() {
        const { handleTableRefresh } = this.props;
        
        return (
            <div>
                <div className="page-header">
                    <h1> Headers </h1>
                    <button 
                        type="button" 
                        className="btn btn-default" 
                        onClick={ handleTableRefresh} > 
                        Refresh Table
                    </button>
                </div>
            </div>
        );
    }
}
TitleComponent.propTypes = {
    handleTableRefresh: PropTypes.func.isRequired,
};

export class RemotePaging extends React.Component {
    constructor(props) {
        super(props);
    }

    renderPaginationShowsTotal(start, to, total) {
        return (
            <p style={ { color: 'blue' } }>
            From { start } to { to }, totals is { total }  (its a customize text)
            </p>
        );
    }

    render() {
        const options = {
            sizePerPage: this.props.sizePerPage,
            onPageChange: this.props.onPageChange,
            sizePerPageList: [5, 10, 25, 50],
            page: this.props.currentPage,
            onSizePerPageList: this.props.onSizePerPageList,
            paginationShowsTotal: true
        }

        return (        
            <BootstrapTable data={ this.props.data } 
                remote={ true } 
                pagination={ true }
                fetchInfo={ { dataTotalSize: this.props.totalDataSize } }
                options={ options }>

                <TableHeaderColumn dataField='id' isKey={ true }>Request #</TableHeaderColumn>
                <TableHeaderColumn dataField='requestId'>Request ID</TableHeaderColumn>
                <TableHeaderColumn dataField='initiator'>Initiator</TableHeaderColumn>
                <TableHeaderColumn dataField='timeStamp'>Timestamp</TableHeaderColumn>
                <TableHeaderColumn dataField='type'>Type</TableHeaderColumn>
                <TableHeaderColumn dataField='url'>URL</TableHeaderColumn>
                <TableHeaderColumn dataField='statusCode'>Status Code</TableHeaderColumn>
                <TableHeaderColumn dataField='statusLine'>Status Line</TableHeaderColumn>
            </BootstrapTable>
        );
    }
}

RemotePaging.propTypes = {
    data: PropTypes.array.isRequired,
    totalDataSize: PropTypes.number.isRequired,
    sizePerPage: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onSizePerPageList: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
};