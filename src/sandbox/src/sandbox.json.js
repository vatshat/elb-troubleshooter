
// https://www.codeproject.com/Articles/1265477/TensorFlow-js-Predicting-Time-Series-Using-Recursi

import {
    trainModel,
    modelParamters
} from './sandbox2.json.js';

const tensorflow = async () => {    
    
    let 
        predict = async (
            {
                actualValueOutputs, predictedInputs, 
                totalInputValues, totalDates,

                stdDev, moments, 
            }, 
            model
        ) => {
            
            let 
                predictedOutputs = await model.predict(
                    tf.tensor2d(
                        predictedInputs,
                        [predictedInputs.length, predictedInputs[0].length]
                    ).div(tf.scalar(10))
                ).mul(10),
                unnormalize = tensor => Array.from(tensor.mul(stdDev).add(moments.mean).dataSync());

            return {
                "actualValueOutputs": unnormalize(tf.tensor1d(actualValueOutputs)),
                "predictedOutputs": unnormalize(predictedOutputs),
                "totalInputValues": unnormalize(tf.tensor1d(totalInputValues)),
                // "predictedInputs": predictedInputs.map(x => unnormalize(tf.tensor1d(x))),
                totalDates,
            };
        },
        initializedModel = tf.sequential(),
        parameterModel = await fetch('sandbox.json')
                            .then(response => response.json())
                            .then(json => modelParamters(json)),
        modelCreate = async () => {        

            let 
                result = await trainModel(parameterModel, initializedModel),
                message = 'Your model has been successfully trained...';

            document.getElementById("messageTrain").textContent += message;
            console.log(message);
            
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