import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, Glyphicon } from 'react-bootstrap';
import { array, func, bool, number} from 'prop-types';
import ReactJson from 'react-json-view'
import { CSVLink } from 'react-csv';

const TableExpandComponent = props => {        
    return (
        <div className='col-sm-4'>
            <ReactJson 
                src={props.data} 
                name="headers"
                displayDataTypes={ false }
            />
        </div>
    );
}

export class ActualBootTableComponent extends React.Component {
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

    _overlay() { 
        const { toggleCapture, headersLength } = this.props;

        if (toggleCapture) {
            return (
                <div>                 
                    <h4>For performance reasons, cannot view headers while capturing. Stop capturing to view headers...</h4>
                    <h5 style={{ color: 'rgb(203, 75, 22)' }}>Captured a total of <strong> { headersLength > 0? headersLength : 0 } </strong> HTTP headers so far</h5>
                    <div id="loader" />
                </div>
            );
        }
        else {
            return 'There are no headers captured';
        }        
    }

    render() {
        let options = {
            sizePerPageList: [10, 25, 50, 100],
            paginationShowsTotal: true,
            noDataText: this._overlay(),
            defaultSortName: 'id', // default sort column name
            defaultSortOrder: 'asc' // default sort order
        }

        const selectRow = {
            mode: 'checkbox',
            clickToExpand: true, // click to expand row, default is false
            //clickToSelect: true, // click to select, default is false
            onSelect: this.props.rowSelectHandler,
            onSelectAll: this.props.rowSelectAllHandler
        };

        return (
            <BootstrapTable id='temp' data={ this.props.data }
                pagination={ true }
                options={ options }
                bordered={ false }
                search
                searchPlaceholder='Filter below table based on any column' 

                expandableRow={ () => { return true; } }
                expandComponent={ this.expandComponent }
                expandColumnOptions={ { expandColumnVisible: true, expandColumnBeforeSelectColumn: false } }
                selectRow={ selectRow }
                headerStyle={ { color: this.props.toggleCapture? '#2fa4e7' : 'rgb(203, 75, 22)', whiteSpace: 'normal' } }
            >

                <TableHeaderColumn dataField='id' isKey={ true } width='5%' headerAlign='center' dataAlign='center' dataSort>#</TableHeaderColumn>
                <TableHeaderColumn dataField='requestId' headerAlign='center' dataAlign='center' dataSort>Request ID</TableHeaderColumn>
                <TableHeaderColumn dataField='initiator' columnTitle={ true } width='15%' dataSort>Initiator</TableHeaderColumn>
                <TableHeaderColumn dataField='headerType' headerAlign='center' dataAlign='center' dataSort>HTTP Type</TableHeaderColumn>
                <TableHeaderColumn dataField='timeStamp' columnTitle={ true } width='10%' dataSort>Timestamp</TableHeaderColumn>
                <TableHeaderColumn dataField='type' columnTitle={ true } width='10%' headerAlign='center' dataAlign='center' dataSort>Type</TableHeaderColumn>
                <TableHeaderColumn dataField='url' columnTitle={ true } width='30%' dataSort>URL</TableHeaderColumn>
                <TableHeaderColumn dataField='statusCode' headerAlign='center' dataAlign='center' dataSort>Status Code</TableHeaderColumn>
            </BootstrapTable>
        )
    }
}

const ExportCSVComponent = props => {        
        
    const headers = [
        { label: 'ID', key: 'id' },
        {label: 'Request ID', key: 'requestId'},
        {label: 'Initiator', key: 'initiator'},
        {label: 'Time stamp', key: 'timeStamp'},
        {label: 'Type', key: 'type'},
        {label: 'URL', key: 'url'},
        {label: 'Status Code', key: 'statusCode'},
        {label: 'Status Line', key: 'statusLine'},
        {label: 'Header Type', key: 'headerType'},
        {label: 'HTTP Headers', key: 'headers'},
    ];

    const data = props.data.map((header) => {
        if ( typeof header.responseHeaders === 'object' ) {
            let {responseHeaders, ...headerNew} = header                

            return {
                ...headerNew,
                headers: JSON.stringify(header.responseHeaders)
            }
        }
        else if ( typeof header.requestHeaders === 'object' ) {
            let {requestHeaders, ...headerNew} = header;                

            return {
                ...headerNew,
                headers: JSON.stringify(header.requestHeaders)
            }
        }
    })

    return (             
        <CSVLink 
            headers={headers}
            data={data}
            separator={";"}
            filename={`headers-${ new Date().toISOString() }.csv`}
        >
            <Button className='export-csv'>
                <Glyphicon glyph="export" /> 
                {' '}
                    Export to CSV
            </Button> 
        </CSVLink>
    )
}

const TableBootstrapComponent = props => {
    return (      
        <div>  
            <ExportCSVComponent data={ props.data } />  
            <ActualBootTableComponent { ...props } />                       
        </div>
    );
}

export default TableBootstrapComponent

TableBootstrapComponent.propTypes = {
    data: array.isRequired,
    rowSelectHandler: func.isRequired,
    rowSelectAllHandler: func.isRequired,
    toggleCapture: bool.isRequired, 
    headersLength: number.isRequired,
};