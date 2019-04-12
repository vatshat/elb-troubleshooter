
// https://www.codeproject.com/Articles/1265477/TensorFlow-js-Predicting-Time-Series-Using-Recursi

import {
    trainModel,
    modelParamters
} from './sandbox2.json.js';

tf.tidy(() => {
    const tensorflow = async () => {    
        
        let 
            predict = async (
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
                        // "predictedInputs": predictedInputs.map(x => unnormalize(tf.tensor1d(x))),
                        totalDates,
                    };
                    
                actualPredictionOutputs.dispose();
                predictedTestOutputs.dispose();

                return {...returnValue}
            },
            initializedModel = tf.sequential(),
            parameterModel = await fetch('sandbox.json')
                                .then(response => response.json())
                                .then(json => modelParamters(json)),
            modelCreate = async () => {        

                let 
                    result = await trainModel(parameterModel, initializedModel),
                    message = 'Your model has been successfully trained...';
                    
                document.getElementById("messageTrain").insertAdjacentHTML('afterbegin', message);
                
                await result.model.save('indexeddb://tfjs-model');
                // await result.model.save(`file://${path.join(__dirname)}/../tfjs-model`);
    
                return result;
            },
            modelLoad = async () => {
                return await tf.loadModel('indexeddb://tfjs-model');
            },
            newModel = true ? await modelCreate() : await modelLoad();
        
        return await predict(parameterModel, newModel.model).then(prediction => prediction);
    }
    
    window.tensorflow = tensorflow;
})