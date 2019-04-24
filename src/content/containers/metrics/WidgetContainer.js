import React from 'react';
import { func, oneOf } from 'prop-types';
import WidgetComponent from '../../components/metrics/WidgetComponent';

import Prediction2 from './Temp.mjs'
import Prediction from './Prediction.mjs'
import TensorFlowRNN from './TensorFlowRNN.mjs'

class WidgetContainer extends React.Component {
    static propTypes = {
        predictionStatusDispatch: func.isRequired,
        predictionStatus: oneOf(['training', 'error', "success", "initial"]).isRequired,
    }
    
    state = {
        drawLine: true,
        predictionStateStatus: "initial",
        predictedDatapoints: [],
    }

    onChangeDrawLineHandler = eventChecked => {
        this.setState({
            drawLine: eventChecked.target.checked
        })
    }

    onEnablePredictionHandler = async (eventChecked) => {

        if (this.state.predictionStateStatus !== "error" ) {

            if (this.state.predictedDatapoints.length > 0) {

                this.props.predictionStatusDispatch(
                    eventChecked.target.checked == "show" ? "hide" : "show"
                );

                this.setState({
                    predictionStateStatus: eventChecked.target.checked == "show" ? "hide" : "show"
                });
            }
            else {
                try {
                    this.setState({ predictionStateStatus: "training" });

                    this.props.predictionStatusDispatch("training");

                    setTimeout(async () => {

                        this.props.predictionStartDispatch(this.props.id)
                        console.log(
                            await window.prediction2(
                                this.props.predictionProgressDispatch,
                                this.props.id
                            )
                        );

                        this.setState({ 
                            predictedDatapoints: [1],
                            predictionStateStatus: "success"
                        });

                        this.props.predictionStatusDispatch("success");

                    }, 1000);

                } catch (e) {
                    this.props.predictionStatusDispatch("error");

                    this.setState({ predictionStateStatus: "error" });
                }                
            }
        }
    }

    render() {

        let predictionStatus = this.props.predictionStatus == "training" ?
                                                    "training" : this.state.predictionStateStatus;

        return ( 
            <div>

                <WidgetComponent 
                    { ...this.props }
                    { ...this.state }

                    predictionStatus = { predictionStatus }
                    onChangeDrawLineHandler = { this.onChangeDrawLineHandler }
                    onEnablePredictionHandler = { this.onEnablePredictionHandler }
                    onChangePredictionHandler = { () => {}}
                    data = {
                        // add time feature here
                        this.props.data.slice(0, 250)
                    }
                />
            </div>
        )
    }
}

export default WidgetContainer;