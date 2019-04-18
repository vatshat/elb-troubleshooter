import React from 'react';
import WidgetComponent from '../../components/metrics/WidgetComponent';

class WidgetContainer extends React.Component {
    static propTypes = {

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
        // await this.props.testDispatch()

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

                    setTimeout(() => {
                        this.setState({ 
                            predictedDatapoints: [1],
                            predictionStateStatus: "success"
                        });

                        this.props.predictionStatusDispatch("success");

                    }, 5000);

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
                />
            </div>
        )
    }
}

export default WidgetContainer;