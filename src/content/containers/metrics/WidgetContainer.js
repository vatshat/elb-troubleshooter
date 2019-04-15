import React from 'react';
import WidgetComponent from '../../components/metrics/WidgetComponent';

class WidgetContainer extends React.Component {
    static propTypes = {

    }

    state = {
        drawLine: true,
        predictionStatus: "initial",
        predictedDatapoints: []
    }

    onChangeDrawLineHandler = eventChecked => {
        this.setState({
            drawLine: eventChecked.target.checked
        })
    }

    onEnablePredictionHandler = async (eventChecked) => {
        // await this.props.testDispatch()

        if (this.state.predictionStatus !== "error" ) {

            if (this.state.predictedDatapoints.length > 0) {
                this.setState({
                    predictionStatus: eventChecked.target.checked == "show" ? "hide" : "true"
                });
            }
            else {
                try {
                    this.setState({ predictionStatus: "training" });

                    setTimeout(() => {
                        this.setState({ 
                            predictedDatapoints: [1],
                            predictionStatus: "success" 
                        });
                    }, 5000);

                } catch (e) {
                    this.setState({ predictionStatus: "error" });
                }                
            }
        }                
    }

    render() {
        return ( 
            <WidgetComponent 
                { ...this.props }
                { ...this.state }

                onChangeDrawLineHandler = { this.onChangeDrawLineHandler }
                onEnablePredictionHandler = { this.onEnablePredictionHandler }
            />
        )
    }
}

export default WidgetContainer;