import React from 'react';
import { func } from 'prop-types'
import ListGroup from 'react-bootstrap/lib/ListGroup'
import { Alert, Panel, Checkbox, ListGroupItem, Table } from 'react-bootstrap';

class WidgetOptions extends React.Component {

    static propTypes = {
        onEnablePredictionHandler: func.isRequired,
        onChangePredictionHandler: func.isRequired,
        onChangeDrawLineHandler: func.isRequired,
    }
    
    state = { 
        open: true,
    }

    render() {

        let 
            trainingElement,
            { predictionStatus, predictionProgress, showTrainingCheckbox } = this.props,
            resultsElement = predictionProgress => {
                return (
                    predictionProgress.length < 1 ?
                            null
                            :
                            <div>
                                <div className="col-sm-12">
                                    <p>
                                        {
                                            `Currently on epoch/iteration ${predictionProgress.slice(-1)[0].iteration} of training.`
                                        }
                                    </p>
                                    <p>
                                        {
                                            `The model currently has ${predictionProgress.slice(-1)[0].minLoss.loss} loss.`
                                        }
                                    </p>                                    
                                    <p>
                                        {
                                            `Currently on epoch/iteration ${predictionProgress.slice(-1)[0].iteration} of training.`
                                        }
                                    </p>                                    
                                    <p>
                                        {
                                            `This loss value hasn't improved in the past ${predictionProgress.slice(-1)[0].epoches} epoches/iteration.`
                                        }
                                    </p>                                    
                                    <p>
                                        {
                                            `The model will stop being trained if the loss doesn't improve for 18 iterations or after 200 epoches.`
                                        }
                                    </p>
                                </div>
                                <Table striped bordered hover size="sm">
                                    <thead>
                                        <tr>
                                            <th>Iteration</th>
                                            <th>Epoches</th>
                                            <th>Loss</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            predictionProgress.map((item, index) => 
                                                    <tr key={index}>
                                                        <td>{item.iteration}</td>
                                                        <td>{item.minLoss.epoches}</td>
                                                        <td>{item.minLoss.loss}</td>
                                                    </tr>
                                            )
                                        }
                                    </tbody>
                                </Table>
                            </div>                    
                )
            },
            trainingResults = (
                <Panel>
                    <Panel.Heading>
                        <Panel.Title toggle>Click here to view training results:</Panel.Title>
                    </Panel.Heading>
                    <Panel.Collapse>
                        <Panel.Body>
                            {
                                predictionProgress != undefined ? 
                                    resultsElement(predictionProgress)
                                    : null
                            }
                        </Panel.Body>
                    </Panel.Collapse>                    
                </Panel>
            );

        switch (predictionStatus) {
            case "initial":
                trainingElement = <button
                    onClick = { this.props.onEnablePredictionHandler }
                >
                    Click here to train
                </button>

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
                                        variant="secondary">
                                        Training data...
                                        <hr />
                                        {
                                            showTrainingCheckbox ?
                                                <Checkbox 
                                                    inline
                                                    id={`stop-${this.props.id}`}
                                                    disabled={this.props.disableTraining}
                                                    onChange= {this.props.stopTrainingHandler}
                                                >
                                                    Check box to stop training
                                                </Checkbox>
                                            :
                                            null
                                        }
                                    </Alert>
                                    { showTrainingCheckbox ? trainingResults : null }
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

                <div 
                    className={
                        `col-sm-${
                            (predictionStatus == "training" || predictionStatus == "success") ? 5: 9
                        }`
                    }
                >
                </div>
                
                <Panel className={`col-sm-${
                    (predictionStatus == "training" || predictionStatus == "success") ? 6: 2
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