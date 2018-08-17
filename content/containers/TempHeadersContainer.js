import React from 'react';
import { RemotePaging, TitleComponent } from '../components/tempPage/TempHeadersComponent';

export default class TempPage extends React.Component {
    constructor(props) {
        super(props);
        this.handleCaptureToggleChange = this.toggleHandler.bind(this, 'toggleCapture');
    }

    toggleHandler(key, event) {
        window.captureToggleDispatch(event.target.checked);
    }
    
    render() {
        window.captureToggleDispatch = this.props.captureToggleDispatch;

        return ( 
            <div>            
                <TitleComponent 
                    handleCaptureToggleChange={ this.handleCaptureToggleChange }
                    toggleCapture={ this.props.toggleCapture }
                />

                <RemotePaging  data={ this.props.headersRowList } />
            </div>
        );
    }
}
