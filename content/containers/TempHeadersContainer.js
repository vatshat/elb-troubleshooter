import React from 'react';
import { RemotePaging, TitleComponent } from '../components/tempPage/TempHeadersComponent';

export default class TempPage extends React.Component {
    constructor(props) {
        super(props);
        this.handleCaptureToggleChange = this.toggleHandler.bind(this, 'toggleCapture');
    }

    onPageChange(page, sizePerPage) {
        window.pageTableIndexDispatch(page);
    }

    onSizePerPageList(sizePerPage) {
        window.pageSizeDispatch(sizePerPage);
    }
    toggleHandler(key, event) {
        window.captureToggleDispatch(event.target.checked);
    }
    
    render() {
        window.pageTableIndexDispatch = this.props.pageTableIndexDispatch;
        window.pageSizeDispatch = this.props.pageSizeDispatch;
        window.captureToggleDispatch = this.props.captureToggleDispatch;

        return ( 
            <div>            
                <TitleComponent 
                    handleCaptureToggleChange={ this.handleCaptureToggleChange }
                    toggleCapture={ this.props.toggleCapture }
                />

                <RemotePaging 
                    data={ this.props.headersRowList }
                    totalDataSize = { this.props.headersLength }
                    sizePerPage = { this.props.sizePerPage }
                    currentPage = { this.props.page }
                    onPageChange = { this.onPageChange.bind(this) }
                    onSizePerPageList = { this.onSizePerPageList.bind(this) }                 
                />
            </div>
        );
    }
}
