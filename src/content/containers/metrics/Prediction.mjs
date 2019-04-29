
// https://www.codeproject.com/Articles/1265477/TensorFlow-js-Predicting-Time-Series-Using-Recursi

import {
    trainModel,
    getModelParamters
} from './TensorFlowRNN.mjs';

tf.tidy(() => {
    const prediction = async (metrics, predictionProgress) => {            

        let parameterModel;

        try { parameterModel = getModelParamters(metrics) }
        catch(err) { throw err };

        let
            predictDatapoints = async (
                {
                    actualTestValueOutputs, 
                    predictedTrainInputs, predictedTestInputs,
                    totalInputValues, totalDates,
                    
                    stdDev, moments, 
                }, 
                model
            ) => {
                
                let 
                    predictedTestOutputs = await model.predict(
                        tf.tensor2d(
                            predictedTrainInputs,
                            [predictedTrainInputs.length, predictedTrainInputs[0].length]
                        ).div(tf.scalar(10))
                    ).mul(10),
                    actualPredictionOutputs = await model.predict(
                        tf.tensor2d(
                            predictedTestInputs,
                            [predictedTestInputs.length, predictedTestInputs[0].length]
                        ).div(tf.scalar(10))
                    ).mul(10),
                    unnormalize = tensor => Array.from(tensor.mul(stdDev).add(moments.mean).dataSync()),                    
                    returnValue = {
                        "actualTestValueOutputs": unnormalize(tf.tensor1d(actualTestValueOutputs)),
                        "predictedTestOutputs": unnormalize(predictedTestOutputs),
                        "totalInputValues": unnormalize(tf.tensor1d(totalInputValues)),
                        "actualPredictionOutputs": unnormalize(actualPredictionOutputs),
                        totalDates,
                    },

                    // add stDev to prediction 
                    average = data => data.reduce((sum, value) => sum + value) / data.length,
                    standardDeviation = values => Math.sqrt(average(values.map(value => (value - average(values)) ** 2))),                    
                    bollinger = JSON.parse(JSON.stringify(returnValue["actualPredictionOutputs"]));

                    for (let index = 0; index < bollinger.length; index++) {
                        let
                            arrCurrPos = bollinger.length - index + 1,
                            valCurrPos = bollinger.length - index - 1;

                        bollinger[valCurrPos] = {
                            stdDev: standardDeviation([
                                                        ...returnValue["totalInputValues"],
                                                        ...returnValue["actualPredictionOutputs"],
                                                    ].slice(0, arrCurrPos)
                                    ),
                            returnValue: bollinger[valCurrPos],
                        }

                    }

                actualPredictionOutputs.dispose();
                predictedTestOutputs.dispose();

                return {
                    ...returnValue,
                    bollinger
                }
            },
            initializedModel = tf.sequential(),
            resultModel = await trainModel(parameterModel, initializedModel, predictionProgress)

        return await predictDatapoints(parameterModel, resultModel.model).then(prediction => prediction);                    
    }
    
    window.prediction = prediction;
})