import React from 'react';
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