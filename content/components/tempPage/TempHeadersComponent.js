import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import PropTypes from 'prop-types';
import Toggle from 'react-toggle';

export class TitleComponent extends React.Component {
    
    render() {
        const enable = 'enabled. Please disable capturing to stop the table from auto refreshing in order to view the table';

        return (
            <div>
                <div className='page-header'>
                    <h1> Headers </h1>
                </div>

                
                <div id='captureToggle'>
                    { /* 
                        https://reactjs.org/docs/conditional-rendering.html 
                        https://github.com/aaronshaf/react-toggle/blob/master/src/docs/index.js

                    */ }

                    <Toggle
                        id='toggleCaptures'
                        checked={ this.props.toggleCapture }
                        name='toggleCapture'
                        value='yes'
                        onChange={ this.props.handleCaptureToggleChange } />

                    <h5 
                        style={{
                            color: this.props.toggleCapture ? '#f99829' : '#151d27'
                        }}
                        htmlFor='toggleCapture' > 
                        Capturing { this.props.toggleCapture? enable : 'disabled'} 
                    </h5>

                </div>
            </div>
        );
    }
}
TitleComponent.propTypes = {
    handleCaptureToggleChange: PropTypes.func.isRequired,
    toggleCapture: PropTypes.bool.isRequired,
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

    customTitle(cell, row, rowIndex, colIndex) {
        return `${row.name} for ${cell}`;
    }

    remote(remoteObj) {
        // Only cell editing, insert and delete row will be handled by remote store
        remoteObj.pagination = true;
        return remoteObj;
    }

    render() {
        const options = {
            sizePerPage: this.props.sizePerPage,
            onPageChange: this.props.onPageChange,
            sizePerPageList: [10, 25, 50, 100],
            page: this.props.currentPage,
            onSizePerPageList: this.props.onSizePerPageList,
            paginationShowsTotal: true
        }

        return (        
            <BootstrapTable data={ this.props.data }                 
                remote={ this.remote }
                pagination={ true }
                fetchInfo={ { dataTotalSize: this.props.totalDataSize } }
                options={ options }
                bordered={ false }
                search>

                <TableHeaderColumn dataField='id' isKey={ true } width='5%' headerAlign='center' dataAlign='center'>#</TableHeaderColumn>
                <TableHeaderColumn dataField='requestId' headerAlign='center' dataAlign='center'    >Request ID</TableHeaderColumn>
                <TableHeaderColumn dataField='initiator' columnTitle={ true } width='15%'>Initiator</TableHeaderColumn>
                <TableHeaderColumn dataField='timeStamp' columnTitle={ true } width='10%'>Timestamp</TableHeaderColumn>
                <TableHeaderColumn dataField='type' headerAlign='center' dataAlign='center'>Type</TableHeaderColumn>
                <TableHeaderColumn dataField='url' columnTitle={ true } width='30%'>URL</TableHeaderColumn>
                <TableHeaderColumn dataField='statusCode' headerAlign='center' dataAlign='center'>Status Code</TableHeaderColumn>
                <TableHeaderColumn dataField='statusLine' columnTitle={ true } width='10%'>Status Line</TableHeaderColumn>
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
};