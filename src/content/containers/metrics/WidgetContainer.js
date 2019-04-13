import React from 'react';
// import { func, object } from 'prop-types'
import WidgetComponent from '../../components/metrics/WidgetComponent'

class WidgetContainer extends React.Component {
    static propTypes = {

    }

    state = {
        drawLine: true,
        predictionStatus: "hide",
        predictedDatapoints: []
    }

    onChangeDrawLineHandler = eventChecked => {
        this.setState({
            drawLine: eventChecked.target.checked
        })
    }

    onChangePredictionHandler = async (eventChecked) => {
        // await this.props.testDispatch()

        if (this.state.predictionStatus !== "error" ) {

            if (this.state.predictedDatapoints.length > 0) {
                this.setState({
                    predictionStatus: eventChecked.target.checked == "show" ? "hide" : "true"
                });
            }
            else {
                try {
                    this.setState({ predictionStatus: "loading" });

                    setTimeout(() => {
                        this.setState({ 
                            predictedDatapoints: [1],
                            predictionStatus: "success" 
                        });
                    }, 3000);

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
                onChangePredictionHandler = { this.onChangePredictionHandler }
            />
        )
    }
}

export default WidgetContainer;