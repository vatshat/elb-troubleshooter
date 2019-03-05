
import * as tf from '@tensorflow/tfjs-node';
import consoleLog from './consoleLog'
import { vec1 } from './sandbox2.json'
import path from "path"

// https://www.codeproject.com/Articles/1265477/TensorFlow-js-Predicting-Time-Series-Using-Recursi

class EarlyStoppingCallback extends tf.Callback {
    constructor() {
        super()
        this.historicalLoss = {
            minLoss: {
                epoches: 0,
                loss: 1
            },
            // epochLoss: [{loss: 1}]
        };
    }

    // https://codepen.io/caisq/pen/xzMYZx?editors=0011

    async onEpochEnd(epoch, logs) {
        let 
            { minLoss, epochLoss } = this.historicalLoss,
            { loss: currLoss } = logs;

        this.historicalLoss.minLoss = (minLoss.loss - currLoss) > 0 ?
            {
                loss: currLoss,
                epoches: 0,
            } :
            {
                loss: minLoss.loss,
                epoches: minLoss.epoches + 1,
            };

        if(minLoss.epoches > 0) {
            this.model.stopTraining = true;
        }

        /* 
            let updateHistoricalLoss = index => {
                epochLoss.push({
                        delta: epochLoss[index].loss - currLoss,
                        loss: currLoss
                    });

                this.historicalLoss.minLoss = (minLoss.loss - currLoss) > 0
                                                ? 
                                                {
                                                    loss: currLoss,
                                                    epoches: 0,
                                                }
                                                : 
                                                {
                                                    loss: minLoss.loss,
                                                    epoches: minLoss.epoches+1,
                                                };
            }

            if (epochLoss.length > 4) {            
                epochLoss.shift();
                updateHistoricalLoss(3)
            }
            else {
                updateHistoricalLoss(epochLoss.length - 1)
            }         
            
            consoleLog(this.historicalLoss, {append:true, fileName: "minLoss.json"});

        */

        console.log(this.historicalLoss);
    }
}

export const tensorflow = () => {    
    
    const trainModel = async ({trainInputs, trainOutputs, window_size, n_epochs, learning_rate, n_layers}, model) => {
        /* 
        
            Step 2 - Initialize you model and add layers:

                Initialize a sequential TensorFlow model
                Build your hidden and output layers
                Add your hidden and output layers to the model
                Select your optimizer function
                Select your loss function
                Compile your model
                
        */

        const 
            input_layer_shape = window_size,
            input_layer_neurons = 100,

            rnn_input_layer_features = 10,
            rnn_input_layer_timesteps = input_layer_neurons / rnn_input_layer_features,
            
            rnn_input_shape = [rnn_input_layer_features, rnn_input_layer_timesteps],
            rnn_output_neurons = 20,
            
            rnn_batch_size = window_size,
            
            output_layer_shape = rnn_output_neurons,
            output_layer_neurons = 1,
            
            xs = tf.tensor2d(trainInputs, [trainInputs.length, trainInputs[0].length]).div(tf.scalar(10)),
            ys = tf.tensor2d(trainOutputs, [trainOutputs.length, 1]).reshape([trainOutputs.length, 1]).div(tf.scalar(10));
        
        model.add(tf.layers.dense({
            units: input_layer_neurons,
            inputShape: [input_layer_shape]
        }));
        model.add(tf.layers.reshape({
            targetShape: rnn_input_shape
        }));

        let lstm_cells = [];
        for (let index = 0; index < n_layers; index++) {
            lstm_cells.push(tf.layers.lstmCell({
                units: rnn_output_neurons
            }));
        }

        model.add(tf.layers.rnn({
            cell: lstm_cells,
            inputShape: rnn_input_shape,
            returnSequences: false
        }));

        model.add(tf.layers.dense({
            units: output_layer_neurons,
            inputShape: [output_layer_shape]
        }));

        const opt_adam = tf.train.adam(learning_rate);

        model.compile({
            optimizer: opt_adam,
            loss: 'meanSquaredError'
        });

        const 
            /* 
                // function based method of callback instead of class based method

                callback = (epoch, log) => {
                    console.log(epoch);
                    console.log(log);
                },

            */

            hist = await model.fit(xs, ys, {
                batchSize: rnn_batch_size,
                epochs: n_epochs,
                callbacks: new EarlyStoppingCallback()
                /* 
                    {
                        onEpochEnd: async (epoch, log) => {                            
                            callback(epoch, log);
                        }
                    } 

                */
            });

        return {
            model: model,
            stats: hist
        };
    }

    const Predict = ({actualOutputs, predictedInputs, stdDev, moments}, model) => {
        
        let predictedOutputs = model.predict(
            tf.tensor2d(
                predictedInputs,
                [predictedInputs.length, predictedInputs[0].length]
            ).div(tf.scalar(10))
        ).mul(10);

        return {
            "outps": Array.from(tf.tensor1d(actualOutputs).mul(stdDev).add(moments.mean).dataSync()),
            "pred_vals": Array.from(predictedOutputs.mul(stdDev).add(moments.mean).dataSync()), 
            stdDev
        };
    }

    const modelParamters = raw_vec => {
        let
            n_epochs = 200, // # epochs
            lr_rate = 0.01, // learning rates
            n_hl = 4, // # of hidden layers in lstm network
            n_items = 50, // % of data to use
            
            // data wrangling, preparation, batch, splitting
            window_size = 24,
            ComputeSMA = (time_s, window_size) => {
                let 
                    r_avgs = [],
                    avg_prev = 0;

                for (let i = 0; i <= time_s.length - window_size; i++) {
                    let 
                        curr_avg = 0.00,
                        t = i + window_size;
                        
                    for (let k = i; k < t && k <= time_s.length; k++)
                        curr_avg += time_s[k]['value'] / window_size;

                    r_avgs.push({
                        set: time_s.slice(i, i + window_size),
                        avg: curr_avg
                    });

                    avg_prev = curr_avg;
                }

                return r_avgs;
            },
            dayDatapoints = ((minutePeriod, hours) => ( (60/minutePeriod) * hours))(5, 24),
            daysData = 9,
            totalDataPoints = dayDatapoints*daysData,
            values = raw_vec.map(x => x.value).slice(-1*totalDataPoints),
            moments = tf.moments(values),
            stdDev = tf.sqrt(moments.variance).add(tf.scalar(0.001)),
            normalized = Array.from(
                // z-score
                tf.tensor1d(values).sub(moments.mean).div(stdDev).dataSync()
            ),
            sma_vec = ComputeSMA(
                values.map((x, i) => {
                    return {
                        date: x.date,
                        value: normalized[i]
                    }
                }),
                window_size
            ),
            inputsValues = sma_vec.map(inp_f => {
                return inp_f['set'].map(val => {
                    return val['value'];
                })
            }),
            outputsSMA = sma_vec.map(outp_f => {
                return outp_f['avg'];
            }),

            dayIndex = day => inputsValues.length-(dayDatapoints*(daysData-day+1))-1,
            
            trainInputs = inputsValues.slice(0, dayIndex(7) - dayDatapoints),
            trainOutputs = outputsSMA.slice(dayDatapoints, dayIndex(7)),

            predictedInputs = inputsValues.slice(dayIndex(8), dayIndex(8) + dayDatapoints ),
            actualOutputs = outputsSMA.slice(dayIndex(8) + dayDatapoints, outputsSMA.length-1);
                        
        return {
            trainInputs,
            trainOutputs,
            predictedInputs,
            actualOutputs, 
            window_size, 
            stdDev,
            n_epochs, 
            learning_rate: lr_rate,
            n_layers: n_hl,
            moments
        }
    }

    const beginPrediction = async () => {
        /* 
        
        Step 1 - Prep your data inputs:

            Ensure there are no missing time segments in your data (repeat previous value or interpolate where data is missing)
            Remove the time indicator from the training data
            Scale data down to range between [0, 1] or [-1, 1]
            Break the data set into batches to speed up training
            Slice the batched data into training and testing segments

        */

       let
            initializedModel = tf.sequential(),
            parameterModel = modelParamters(vec1),
            result = await trainModel(parameterModel, initializedModel);

        console.log('Your model has been successfully trained...');
        await result.model.save(`file://${path.join(__dirname)}/../tfjs-model`);

        consoleLog(Predict(parameterModel, result['model']))

        return {}
    }

    beginPrediction()

    /* 
        const modelLoad = async () => {
            const loadModel = await tf.loadModel("file://src/sandbox/tfjs-model/model.json");

            consoleLog({
                outps: outputs.slice(Math.floor(n_items / 100 * outputs.length), outputs.length),
                pred_vals: Predict(inputsSMA, n_items, loadModel)
            })
        }
        
        modelLoad()

    */
}

tensorflow()