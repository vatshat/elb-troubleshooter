import React from 'react';
import { func, oneOf } from 'prop-types';
import WidgetComponent from '../../components/metrics/WidgetComponent';
import { timeParse } from 'd3-time-format'

import Prediction from './Prediction.mjs'
import TensorFlowRNN from './TensorFlowRNN.mjs'

class WidgetContainer extends React.Component {
    static propTypes = {
        predictionStatusDispatch: func.isRequired,
        predictionStatus: oneOf(['training', 'error', "success", "initial"]).isRequired,
    }

    componentWillReceiveProps({ predictionStatus, predictedDatapoints }) {

        if (
            predictionStatus == "success" &&
            "bollinger" in predictedDatapoints &&
            predictedDatapoints.length !== this.props.predictedDatapoints.length
        ) {
            let
                { totalDates, bollinger } = predictedDatapoints,
                newData = [
                    ...this.state.data,
                    ...bollinger.map((x, i, a) => ({
                            date: timeParse("%Y-%m-%dT%H:%M:%S.%LZ")(totalDates[totalDates.length - a.length + i]),
                            value: x.value,
                            stDev: x.stDev,
                    }))
                    .sort((a, b) => a.date - b.date),
                ];

            this.setState({
                data:newData,
                dataMean: newData.reduce((total, dataPoint) => total + dataPoint.value, 0) / newData.length,
            })
        }
    }

    state = {
        drawLine: true,
        showTrainingCheckbox: false,
        disableTraining: false,
        predictionStatus: "initial",
        data: this.props.metricData.map(x => {
                return {
                    ...x,
                    date: timeParse("%Y-%m-%dT%H:%M:%SZ")(JSON.parse(JSON.stringify(x.date)))
                }
            })
            .sort((a, b) => a.date - b.date),
        dataMean: this.props.metricData.reduce((total, dataPoint) => total + dataPoint.value, 0) / this.props.metricData.length,
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
                            this.state.data, {
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

        let { predictionStatus } = this.props

        return (
            <div>

                <WidgetComponent
                    { ...this.props }
                    { ...this.state }

                    data = {
                        // add time feature here
                        this.state.data.slice(-250)
                    }

                    predictionStatus = {
                        this.props.predictionStatus == "training" ? predictionStatus : this.state.predictionStatus
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
