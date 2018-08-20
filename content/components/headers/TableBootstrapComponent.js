import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import PropTypes from 'prop-types';

class TableExpandComponent extends React.Component {    
    render() {
        return (
            <pre style={{wordWrap:'normal'}} className='col-sm-12'>
                {JSON.stringify(this.props.data, null, 2)}
            </pre>
        );
    }
}

export class TableBootstrapComponent extends React.Component {
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
    
    expandComponent(row) {
        const propData = typeof row.requestHeaders === 'undefined' ? row.responseHeaders : row.requestHeaders;

        let dataProp = {};

        propData.map((header) => {
            dataProp = {
                ...dataProp,
                [header.name]:header.value
            }            
        });

        return (
            <TableExpandComponent data={ dataProp } />
        );
    }

    render() {
        const options = {
            sizePerPageList: [10, 25, 50, 100],
            paginationShowsTotal: true,
            clearSearch: true
        }

        const selectRow = {
            mode: 'checkbox',
            clickToExpand: true, // click to expand row, default is false
            //clickToSelect: true, // click to select, default is false
            onSelect: this.props.rowSelectHandler,
            onSelectAll: this.props.rowSelectAllHandler
        };

        return (        
            <BootstrapTable data={ this.props.data }
                pagination={ true }
                options={ options }
                bordered={ false }
                search
                searchPlaceholder='Search below table' 

                expandableRow={ () => { return true; } }
                expandComponent={ this.expandComponent }
                expandColumnOptions={ { expandColumnVisible: true, expandColumnBeforeSelectColumn: false } }
                selectRow={ selectRow }>

                <TableHeaderColumn dataField='id' className='td-header-style' isKey={ true } width='5%' headerAlign='center' dataAlign='center'>#</TableHeaderColumn>
                <TableHeaderColumn dataField='requestId' className='td-header-style' headerAlign='center' dataAlign='center'    >Request ID</TableHeaderColumn>
                <TableHeaderColumn dataField='initiator' className='td-header-style' columnTitle={ true } width='15%'>Initiator</TableHeaderColumn>
                <TableHeaderColumn dataField='headerType' className='td-header-style' headerAlign='center' dataAlign='center'>HTTP Type</TableHeaderColumn>
                <TableHeaderColumn dataField='timeStamp' className='td-header-style' columnTitle={ true } width='10%'>Timestamp</TableHeaderColumn>
                <TableHeaderColumn dataField='type' className='td-header-style' headerAlign='center' dataAlign='center'>Type</TableHeaderColumn>
                <TableHeaderColumn dataField='url' className='td-header-style' columnTitle={ true } width='30%'>URL</TableHeaderColumn>
                <TableHeaderColumn dataField='statusCode' className='td-header-style' headerAlign='center' dataAlign='center'>Status Code</TableHeaderColumn>
                <TableHeaderColumn dataField='statusLine' className='td-header-style' columnTitle={ true } width='10%'>Status Line</TableHeaderColumn>
            </BootstrapTable>
        );
    }
}

TableBootstrapComponent.propTypes = {
    data: PropTypes.array.isRequired,
    rowSelectHandler: PropTypes.func.isRequired,
    rowSelectAllHandler: PropTypes.func.isRequired
};