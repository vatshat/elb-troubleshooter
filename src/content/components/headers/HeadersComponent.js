import React from 'react';
import PropTypes from 'prop-types';
import Toggle from 'react-toggle';
import ReactJson from 'react-json-view'
import { Panel, Well } from 'react-bootstrap';

export class ToggleComponent extends React.Component {    
    render() {
        
        const { toggleCapture } = this.props;

        const toggleTitleStyle = { color: toggleCapture ? '#2fa4e7' : '#151d27' };

        return (        
            <div id='captureToggle'>
                { /* 
                    https://reactjs.org/docs/conditional-rendering.html 
                    https://github.com/aaronshaf/react-toggle/blob/master/src/docs/index.js

                */ }

                <Toggle
                    id='toggleCaptures'
                    checked={ toggleCapture }
                    name='toggleCapture'
                    value='yes'
                    onChange={ this.props.handleCaptureToggleChange } />
                
                { 
                    toggleCapture? 
                    <h4 
                        style={ toggleTitleStyle }
                        htmlFor='toggleCapture' > 
                        Capturing enabled <small>...Please disable capturing to show the table</small>
                    </h4>
                    :           
                    <h4 
                        style={ toggleTitleStyle }
                        htmlFor='toggleCapture' > 
                        Capturing disabled <small>...Toggle above switch to start capturing</small> 
                    </h4>                        
                }
                
            </div>
        )
    }
}

ToggleComponent.propTypes = {
        handleCaptureToggleChange: PropTypes.func.isRequired,
        toggleCapture: PropTypes.bool.isRequired,
}

export class SelectedHeadersComponent extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = { open: false };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.selectedHeaders.length > 0) {
            if (this.state.open == false) {
                this.setState({
                    open: false
                })
            }
        }
    }

    render() {

        const { selectedHeaders } = this.props;
        
        let rowSelectedHeaders;
        let collapseTitle = 
            <p>
                No headers selected <small>...select checkbox in any row in the below table to view header details</small>
            </p>;
        if (selectedHeaders.length > 0) {            
            // https://www.sitepoint.com/javascript-truthy-falsy/
            
            const { open } = this.state;

            rowSelectedHeaders = 
                <Panel expanded={ open } onToggle={() => {}}>
                    <Panel.Collapse>
                        <Panel.Body style={{ overflow: 'auto', height: '300px', whiteSpace: 'nowrap', backgroundColor: 'rgb(245, 245, 245)'}}>
                            <table>
                                <tbody>
                                    <tr style={{ verticalAlign: 'top' }}>
                                        { 
                                            // https://thinkster.io/tutorials/iterating-and-rendering-loops-in-react
                                            selectedHeaders.map((selectedHeader, index) => {
                                                return <td
                                                            key={index}
                                                            style={{ display: 'inline-block' }}
                                                        >
                                                            <ReactJson 
                                                                src={selectedHeader} 
                                                                name='headers'
                                                                displayDataTypes={ false }
                                                                collapseStringsAfterLength= { 20 }
                                                                style={{ wordWrap: 'normal' }}
                                                                collapsed={ 1 }
                                                            />
                                                        </td>
                                            })
                                        }
                                    </tr>
                                </tbody>
                            </table>
                        </Panel.Body>
                    </Panel.Collapse>
                </Panel>

                collapseTitle = this.state.open?
                    <p>
                        <span className="glyphicon glyphicon-minus" style={{ color: '#2fa4e7' }}></span>
                        {' '} 
                        <a 
                            onClick={
                                () => this.setState((prevState, props) => ({
                                    open: !prevState.open
                                }))
                            } 
                        >
                            Click here to collapse the selected headers
                        </a>
                    </p>
                    :
                    <p>    
                        <span className="glyphicon glyphicon-plus" style={{ color: '#2fa4e7' }}></span>
                        {' '} 
                        < a 
                            onClick = {
                                () => this.setState((prevState, props) => ({
                                    open: !prevState.open
                                }))
                            } 
                        >
                            Click here to expand the selected headers
                        </a>
                    </p>
        }

        return (            
            <Well> 
                <h4 style={{ cursor: 'pointer', color: 'rgb(203, 75, 22)' }} >
                    { collapseTitle }
                </h4>
                { rowSelectedHeaders }
            </Well>
        )
    }
}

SelectedHeadersComponent.propTypes = {
    selectedHeaders: PropTypes.array.isRequired,
}

export default class ContentComponent extends React.Component {
    render() { 
        
        return (
            <div>
                <div className='page-header'>
                    <h1 style= {{ color: 'rgb(203, 75, 22)' }}> Headers </h1>
                </div>                
                
                <ToggleComponent 
                    toggleCapture={ this.props.toggleCapture } 
                    handleCaptureToggleChange= { this.props.handleCaptureToggleChange }
                />

                <SelectedHeadersComponent selectedHeaders={ this.props.selectedHeaders } />                
            </div>
        );
    }
}

ContentComponent.propTypes = {
    handleCaptureToggleChange: PropTypes.func.isRequired,
    toggleCapture: PropTypes.bool.isRequired,
    selectedHeaders: PropTypes.array.isRequired,
};