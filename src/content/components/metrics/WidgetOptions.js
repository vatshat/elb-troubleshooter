import React from 'react';
import { func } from 'prop-types'
import ListGroup from 'react-bootstrap/lib/ListGroup'
import { Alert, Panel, Checkbox, ListGroupItem } from 'react-bootstrap';

class WidgetOptions extends React.Component {

    static propTypes = {
        onEnablePredictionHandler: func.isRequired,
        onChangePredictionHandler: func.isRequired,
        onChangeDrawLineHandler: func.isRequired,
    }
    
    state = { open: true }

    render() {

        let 
            trainingElement,
            { predictionStatus, predictionProgress } = this.props,
            trainingResults = (
                <Panel>
                    <Panel.Heading>
                        <Panel.Title toggle>Training results:</Panel.Title>
                    </Panel.Heading>
                    <Panel.Collapse>
                        <Panel.Body>
                            {
                                predictionProgress != undefined ? 
                                    predictionProgress.map((item, index) => (
                                        <div 
                                            className="col-sm-12" 
                                            key={index}
                                        >
                                            {item}                                            
                                        </div>)
                                    )
                                    // .join("<br />") 
                                    : null
                            }
                        </Panel.Body>
                    </Panel.Collapse>                    
                </Panel>
            );

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
                trainingElement = 
                                <div className="training-results">
                                    <Alert 
                                        className = {"training_update"}
                                        variant="secondary">
                                        Training data
                                    </Alert>
                                    {trainingResults}    
                                </div>
                break;
            
            case "success":
                trainingElement = 
                                <div className="training-results">
                                    <Checkbox 
                                        inline
                                        onChange={this.props.onChangePredictionHandler}
                                    >
                                        Prediction
                                    </Checkbox>
                                    {trainingResults}
                                </div>
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

                <div className={`col-sm-${
                    (predictionStatus == "training" || predictionStatus == "success") ? 7: 9
                }`}
                ></div>
                <Panel className={`col-sm-${
                    (predictionStatus == "training" || predictionStatus == "success") ? 4: 2
                }`}>
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