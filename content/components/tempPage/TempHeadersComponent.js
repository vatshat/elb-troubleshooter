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
                    <h1 style= {{ color: '#fb9828' }}> Headers </h1>
                </div>
                
                <div className="row">
                    <div className="input-group col-sm-4">
                        <span className="input-group-addon"> URL </span>
                        <input id="msg" type="text" className="form-control" name="msg" placeholder="Please enter url of HTTP endpoint" />
                    </div>
                    <br />
                    { /* <button type="submit" className={'btn btn-default ' + styles.url_submit} onClick={this.reloadHeaders.bind(this)}>Send request</button> */ }
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


class ActualHeaders extends React.Component {    
    render() {
        return (
            <pre style={{wordWrap:'normal'}} className='col-sm-12'>
                {JSON.stringify(this.props.data, null, 2)}
            </pre>
        );
    }
}

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
            <ActualHeaders data={ dataProp } />
        );
    }

    render() {
        const options = {
            sizePerPageList: [10, 25, 50, 100],
            paginationShowsTotal: true
        }

        const selectRow = {
            mode: 'checkbox',
            //clickToSelect: true, // click to select, default is false
            clickToExpand: true // click to expand row, default is false
        };

        return (        
            <BootstrapTable data={ this.props.data }
                pagination={ true }
                options={ options }
                bordered={ false }
                search

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

RemotePaging.propTypes = {
    data: PropTypes.array.isRequired,
};