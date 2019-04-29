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
    }

    onChangeDrawLineHandler = eventChecked => {
        this.setState({
            drawLine: eventChecked.target.checked
        })
    }

    onEnablePredictionHandler = async (eventChecked) => {

        if (this.props.predictionStatus !== "error" ) {

            if (this.state.predictedDatapoints.length > 0) {

                this.props.predictionStatusDispatch(
                    eventChecked.target.checked == "show" ? "hide" : "show"
                );

            }
            else {
                try {
                    this.setState({ predictionStateStatus: "training" });

                    this.props.predictionStatusDispatch("training");
<<<<<<< Updated upstream
<<<<<<< HEAD

                    setTimeout(async () => {

                        this.props.predictionStartDispatch(this.props.id)
                        console.log(
                            await window.prediction2(
                                this.props.predictionProgressDispatch,
                                this.props.id
                            )
                        );
=======
>>>>>>> 16ea7a26e932f16e7c75a319b1326015f62e1faa

                        this.setState({ 
                            predictedDatapoints: [1],
                            predictionStateStatus: "success"
                        });

                        this.props.predictionStatusDispatch("success");

<<<<<<< HEAD
                    }, 1000);
=======
                    }, 5000);
>>>>>>> 16ea7a26e932f16e7c75a319b1326015f62e1faa
=======
                    
                    this.props.predictionStartDispatch(this.props.id)

                    this.setState({ 
                        predictedDatapoints: [1],
                        predictionStateStatus: "success"
                    });            
>>>>>>> Stashed changes

                } catch (e) {
                    this.props.predictionStatusDispatch("error");
                }                
            }
        }
    }

    render() {

        let { predictionStatus } = this.props.predictionStatus;

        return ( 
            <div>
<<<<<<< HEAD

=======
>>>>>>> 16ea7a26e932f16e7c75a319b1326015f62e1faa
                <WidgetComponent 
                    { ...this.props }
                    { ...this.state }

                    predictionStatus = { predictionStatus }
                    onChangeDrawLineHandler = { this.onChangeDrawLineHandler }
                    onEnablePredictionHandler = { this.onEnablePredictionHandler }
<<<<<<< HEAD
                    onChangePredictionHandler = { () => {}}
                    data = {
                        // add time feature here
                        this.props.data.slice(0, 250)
                    }
=======
>>>>>>> 16ea7a26e932f16e7c75a319b1326015f62e1faa
                />
            </div>
        )
    }
}

export default WidgetContainer;