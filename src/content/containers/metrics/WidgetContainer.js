import React from 'react';
import { func, oneOf } from 'prop-types';
import WidgetComponent from '../../components/metrics/WidgetComponent';

import Prediction from './Prediction.mjs'
import TensorFlowRNN from './TensorFlowRNN.mjs'

class WidgetContainer extends React.Component {
    static propTypes = {
        predictionStatusDispatch: func.isRequired,
        predictionStatus: oneOf(['training', 'error', "success", "initial"]).isRequired,
    }
    
    state = {
        drawLine: true,
        showTrainingCheckbox: false, 
        disableTraining: false,
        predictionStatus: "initial",
    }
    
    stopTrainingHandler = checked => {
        if (checked) {
            this.setState({
                disableTraining: true
            })
        }
    }

    onChangeDrawLineHandler = eventChecked => {
        this.setState({
            drawLine: eventChecked.target.checked, 
        });
    }

    onEnablePredictionHandler = async (eventChecked) => {

        if (this.props.predictionStatus != "error" ) {

            if (this.props.predictedDatapoints.length > 0) {

                this.props.predictionStatusDispatch(
                    eventChecked.target.checked == "show" ? "hide" : "show"
                );                
            }
            else {
                try { 
                    this.props.predictionStatusDispatch("training"); 
                    const { id } = this.props;

                    this.setState({
                        showTrainingCheckbox: true
                    });

                    setTimeout(() => {
                        window.prediction(
                            this.props.data, {
                                predictionProgressDispatch: this.props.predictionProgressDispatch,
                                id: id,
                            }
                        ).then(datapoints => {
                            this.props.predictionStatusDispatch("success");
                            
                            this.setState({ predictionStatus: "success" });
        
                            this.props.predictionCompleteDispatch({
                                id: id,
                                datapoints: datapoints,
                            });
                            
                            this.setState({
                                showTrainingCheckbox: false
                            });

                        }).catch( e => {
                            this.props.predictionStatusDispatch("error");
                            this.setState({ predictionStatus: "error" });
                            throw(e);
                        });
                    }, 2000);

                } 
                catch (e) { 
                    this.props.predictionStatusDispatch("error"); 
                    
                    this.setState({
                        showTrainingCheckbox: false
                    });
                }
            }
        }
    }

    render() {

        return ( 
            <div>

                <WidgetComponent 
                    { ...this.props }
                    { ...this.state }

                    predictionStatus = {
                        this.props.predictionStatus == "training" ? 
                                                        this.props.predictionStatus : this.state.predictionStatus
                    }

                    stopTrainingHandler = { this.stopTrainingHandler }

                    onChangeDrawLineHandler = { this.onChangeDrawLineHandler }
                    onEnablePredictionHandler = { this.onEnablePredictionHandler }
                    onChangePredictionHandler = { () => {} }
                />
            </div>
        )
    }
}

export default WidgetContainer;