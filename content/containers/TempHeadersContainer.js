import React from 'react';
import { RemotePaging, TitleComponent } from '../components/tempPage/TempHeadersComponent';
import Toggle from 'react-toggle';

export default class TempPage extends React.Component {
    constructor(props) {
        super(props);
        this.handleCaptureToggleChange = this.toggleHandler.bind(this, 'toggleCapture');
    }

    onPageChange(page, sizePerPage) {
        window.pageTableIndex(page);
    }

    onSizePerPageList(sizePerPage) {
        window.pageSize(sizePerPage);
    }
    toggleHandler(key, event) {
        window.captureToggleDispatch(event.target.checked);
    }

    handleChange(key, event) {
        this.setState({
            [key]: event.target.checked
        })
    }
    
    render() {
        window.pageTableIndex = this.props.pageTableIndex;
        window.pageSize = this.props.pageSize;
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
