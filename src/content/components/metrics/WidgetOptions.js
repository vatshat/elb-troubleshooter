import React from 'react';
import { Collapse, Button, Alert, Panel, Well,
            Checkbox, FormGroup, ControlLabel, ListGroupItem } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/lib/ListGroup'

class WidgetOptions extends React.Component {

    state = { open: true }

    render() {

        let 
            trainingElement,
            { predictionStatus } = this.props;

        switch (predictionStatus) {
            case "initial":
                trainingElement = <Alert
                    variant="secondary"
                    onClick = { this.props.onEnablePredictionHandler }
                >
                    Click here to train
                </Alert>

                break;
            
            case "error":
                trainingElement = <div 
                                        variant="danger" 
                                        role="alert" 
                                        className="alert alert-danger"
                                    > 
                                        Error occured during training
                                    </div>
                break;

            case "training":
                trainingElement = <Alert 
                    className = {"training_update"}
                    variant="secondary">
                    Training data
                </Alert>
                break;
            
            case "success":
                trainingElement = <Checkbox 
                    inline
                    onChange={this.props.onChangePredictionHandler}
                >
                    Prediction
                </Checkbox>

                break;
                
            default:
                trainingElement = <div 
                                        variant="danger" 
                                        role="alert" 
                                        className="alert alert-danger"
                                    > 
                                        {`Some error occured can't continue with training`}
                                    </div>
        }
        
        return (
            <div className={"widget-options"}>
                <span className={"widget-drag col-sm-1"}></span>

                <div className={"col-sm-9"}></div>
                <Panel className={"col-sm-2"}>
                    <Panel.Heading>
                        <Panel.Title toggle>Widget Options:</Panel.Title>
                    </Panel.Heading>
                    <Panel.Collapse>
                        <Panel.Body>     
                            <ListGroup>
                                <ListGroupItem>
                                    {trainingElement}
                                </ListGroupItem>
                                <ListGroupItem variant="secondary">
                                    <Checkbox 
                                        inline
                                        defaultChecked={true}
                                        onChange={this.props.onChangeDrawLineHandler}
                                    >                            
                                        Draw Line
                                    </Checkbox>
                                </ListGroupItem>
                                <ListGroupItem variant="secondary">                                    
                                    <Checkbox inline>Multi-AZ</Checkbox>
                                </ListGroupItem>                            
                            </ListGroup>
                        </Panel.Body>
                    </Panel.Collapse>
                    
                </Panel>   
            </div>
        )
    }
}

export default WidgetOptions;