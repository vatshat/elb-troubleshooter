import React from 'react';
import ContentComponent from '../components/headers/HeadersComponent';
import TableBootstrapComponent from '../components/headers/TableBootstrapComponent';
import PropTypes from 'prop-types';

export default class HeadersTableContainer extends React.Component {
    constructor(props) {
        super(props);
        this.handlerToggle = this.toggleHandler.bind(this, 'toggleCapture');
        this.captureToggleDispatch = this.props.captureToggleDispatch;
        this.addPreHeadersDispatch = this.props.addPreHeadersDispatch;
        this.disablePreHeadersDispatch = this.props.disablePreHeadersDispatch;
        this.preHeaderCount = this.props.preHeaderCount;
    }

    componentDidMount() {
        this.props.clearPreHeadersDispatch();
    }

    toggleHandler(key, event) {
        this.captureToggleDispatch(event.target.checked);
    }    

    rowSelectHandler(row, isSelected, e, rowIndex) {
        if (isSelected) { 
            this.addPreHeadersDispatch(row.id, this.preHeaderCount); 
        }
        else { 
            this.disablePreHeadersDispatch(row.id);
        }
    }

    rowSelectAllHandler(isSelected, rows) {
        if (isSelected) {
            for (let i = 0; i < rows.length; i++) {
                this.addPreHeadersDispatch(rows[i].id, this.preHeaderCount);
            }
        } else {
            for (let i = 0; i < rows.length; i++) {
                this.disablePreHeadersDispatch(rows[i].id);
            }
        }
    }
    
    render() {
        const { headersRowList, selectedHeaders, toggleCapture } = this.props;
        let displayedHeaders = selectedHeaders.
            sort((a, b) => {
                if (a.position < b.position) { return -1; }
                if (a.position > b.position) { return 1; }
                return 0;
            }).
            map((selectedHeader) => {
                if (selectedHeader.display) {
                    return headersRowList[selectedHeader.id]
                }
            }).
            filter((selectedHeader) => {
                return typeof selectedHeader !== 'undefined'
            });

        return ( 
            <div>            
                <ContentComponent 
                    handleCaptureToggleChange={ this.handlerToggle }
                    toggleCapture={ toggleCapture }
                    selectedHeaders={ typeof headersRowList === 'undefined'? [] : displayedHeaders }
                />

                <TableBootstrapComponent  
                    rowSelectHandler={ this.rowSelectHandler.bind(this) } 
                    rowSelectAllHandler={ this.rowSelectAllHandler.bind(this) } 
                    toggleCapture={ toggleCapture }
                    headersLength={ headersRowList.length }
                    data={ toggleCapture? [] : headersRowList } 
                />

            </div>
        );
    }
}

HeadersTableContainer.propTypes = {
    captureToggleDispatch: PropTypes.func.isRequired,
    addPreHeadersDispatch: PropTypes.func.isRequired,
    disablePreHeadersDispatch: PropTypes.func.isRequired,
    preHeaderCount: PropTypes.number.isRequired,
    clearPreHeadersDispatch: PropTypes.func.isRequired
};