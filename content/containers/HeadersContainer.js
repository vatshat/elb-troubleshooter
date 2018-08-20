import React from 'react';
import { TitleComponent } from '../components/headers/HeadersComponent';
import { TableBootstrapComponent } from '../components/headers/TableBootstrapComponent';

export default class HeadersTableContainer extends React.Component {
    constructor(props) {
        super(props);
        this.handlerToggle = this.toggleHandler.bind(this, 'toggleCapture');
    }

    toggleHandler(key, event) {
        window.captureToggleDispatch(event.target.checked);
    }
    
    rowSelectHandler(row, isSelected, e, rowIndex) {
        if (isSelected) { 
            window.addPreHeadersDispatch(row.id, window.preHeaderCount); 
        }
        else { 
            window.disablePreHeadersDispatch(row.id);
        }
    }

    rowSelectAllHandler(isSelected, rows) {
        if (isSelected) {
            for (let i = 0; i < rows.length; i++) {
                window.addPreHeadersDispatch(rows[i].id, window.preHeaderCount);
            }
        } else {
            for (let i = 0; i < rows.length; i++) {
                window.disablePreHeadersDispatch(rows[i].id);
            }
        }
    }

    render() {
        window.captureToggleDispatch = this.props.captureToggleDispatch;
        window.addPreHeadersDispatch = this.props.addPreHeadersDispatch;
        window.disablePreHeadersDispatch = this.props.disablePreHeadersDispatch;
        window.preHeaderCount = this.props.preHeaderCount;
        // https://stackoverflow.com/questions/5063878/how-to-cleanly-deal-with-global-variables

        return ( 
            <div>            
                <TitleComponent 
                    handleCaptureToggleChange={ this.handlerToggle }
                    toggleCapture={ this.props.toggleCapture }
                />

                <TableBootstrapComponent  
                    rowSelectHandler= { this.rowSelectHandler.bind(this) } 
                    data={ this.props.headersRowList } 
                />

            </div>
        );
    }
}
