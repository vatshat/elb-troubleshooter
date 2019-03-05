import * as tf from '@tensorflow/tfjs-node';
import { csvParse } from 'd3-dsv'
import consoleLog from './consoleLog'

if (typeof fetch !== 'function') {
    global.fetch = require('node-fetch');
}

let 
    sandBoxData, // = sandboxJSON.map(x => x.price),
    tutorialData = [6.93, 5.75, 5, 12.87, 13.56, 13.13, 10.92, 13.6, 5.55, 5.4, 5.75, 5, 12.87, 13.56, 1.13, 10.92, 13.60, 5.55]

let predictionData = originalData => {

    Number.prototype.toFixedNumber = function (x, base) {
        let pow = Math.pow(base || 10, x);
        return Math.round(this * pow) / pow;
    }

    let exponentialSmoothing = data => {
        let
            arrayIndex = [...Array(data.length).keys()],
            inputDataTensor = tf.variable(tf.tensor1d(data, "float32")),
            predictedTensor = tf.variable(tf.zeros([data.length], 'float32')),
            minDecay = [],
            step = 0.01,
            alpha = 0.1;
    
        for (alpha; alpha < 1-step; alpha += step) {    
            
            let 
                mvaTensor = tf.movingAverage(predictedTensor, inputDataTensor, alpha, data.length, true),
                sseTensor = tf.tensor1d([data[0]]).concat(mvaTensor).slice(0, data.length)
    
            inputDataTensor.print()
            mvaTensor.print()
            process.exit()

            predictedTensor.assign(sseTensor)
    
            let 
                    yTrue = tf.tensor2d([arrayIndex, inputDataTensor.dataSync()]),
                    yPred = tf.tensor2d([arrayIndex, sseTensor.dataSync()]),
                    mse = tf.metrics.meanSquaredError(yTrue, yPred);
    
            minDecay = [
                ...minDecay, 
                { 
                    "decay": alpha,
                    "mse" : [...Array.from(
                                mse.slice(1, 1).dataSync()
                            )][0],
                    "data" : [...[
                                ...data,
                                Array.from(
                                        mvaTensor.slice(data.length-1, 1).dataSync()
                                    )[0].toFixedNumber(2)
                                ],
                            ]
                }
            ]
        }
        
        let totalMse = [];

        minDecay = minDecay.reduce((prev, curr) => {            
            totalMse.push(curr.mse)
            return prev.mse < curr.mse ? prev : curr;
        })
        
        // minDecay = {
        //     ...minDecay,
        //     totalMse: totalMse
        // }

        return ((minDecay.data.length - originalData.length) < 10) ? 
                    exponentialSmoothing(minDecay.data) 
                    : 
                    minDecay;
    }

    return exponentialSmoothing(originalData)
}

fetch('http://localhost:8000/temp.csv')
    .then(promise => promise.text())
    .then(response => {
        let passengerData = csvParse(response).map(x => parseFloat(x.Passengers)),
            effectiveData = [passengerData, tutorialData, sandBoxData],
            i = 1

        consoleLog(predictionData(effectiveData[i]))
    })