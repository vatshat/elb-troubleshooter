class EarlyStoppingCallback extends tf.Callback {
    constructor() {
        super()
        this.historicalLoss = {
            minLoss: {
                epoches: 0,
                loss: 1
            },
            iteration: 0,
        };
        
        let pre = document.createElement("pre");
        pre.setAttribute("id", "messageTrain");
        pre.setAttribute("style", "overflow:scroll;height:500px;")
        document.body.insertBefore(pre, document.body.firstChild);
        
    }

    // https://codepen.io/caisq/pen/xzMYZx?editors=0011

    async onEpochEnd(epoch, logs) {
        let 
        { minLoss, epochLoss, iteration } = this.historicalLoss, 
        { loss: currLoss } = logs,
        consoleMessage = JSON.stringify(this.historicalLoss) + '\r\n';

        this.historicalLoss.minLoss = (minLoss.loss - currLoss) > 0 ? {
            loss: currLoss,
            epoches: 0,
        } : {
            loss: minLoss.loss,
            epoches: minLoss.epoches + 1,
        };

        this.historicalLoss.iteration = iteration + 1;
        
        if (
            // this.historicalLoss.iteration > 1 ||
            minLoss.epoches > 0 /* ideal value should be 18 or configurable from UI */
        ) {
            this.model.stopTraining = true;
        }
       
        // document.getElementById("messageTrain").insertAdjacentHTML('afterbegin', consoleMessage);
        console.log(consoleMessage);
    }
}

export const trainModel = async ({trainInputs, trainOutputs, window_size}, model) => {
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
        n_epochs = 200, // # epochs
        learning_rate = 0.01, // learning rates
        n_layers = 4, // # of hidden layers in lstm network

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
        hist = await model.fit(xs, ys, {
            batchSize: rnn_batch_size,
            epochs: n_epochs,
            callbacks: new EarlyStoppingCallback(),
        });

    xs.dispose()
    ys.dispose()
    
    return {
        model: model,
        stats: hist
    };
}

export const modelParamters = rawVec => {

    /* 
            
    https://medium.com/@andrewtrahan/trials-and-triumphs-of-time-series-machine-learning-with-tensorflow-js-4f1a1140fe10
            
    Step 1 - Prep your data inputs:

        Ensure there are no missing time segments in your data (repeat previous value or interpolate where data is missing)
        Remove the time indicator from the training data
        Scale data down to range between [0, 1] or [-1, 1]
        Break the data set into batches to speed up training
        Slice the batched data into training and testing segments

    */

    let
        // data wrangling, preparation, batch, splitting
        window_size = 288,
        Batch = (time_s, window_size) => {
            return [...Array(time_s.length - window_size).keys()].map(i => {
                return {
                    set: time_s.slice(i, i + window_size),
                    future: time_s[i + window_size - 1].value,
                }
            });
        },
        dayDatapoints = ((minutePeriod, hours) => ((60 / minutePeriod) * hours))(5, 24),
        daysData = 9,
        totalDatapoints = dayDatapoints * daysData,
        totalDates = [],
        values = rawVec.slice(-totalDatapoints).map(x => {
            totalDates.push(x.date);
            return x.value
        }),
        moments = tf.moments(values),
        stdDev = tf.sqrt(moments.variance).add(tf.scalar(0.001)),
        normalized = Array.from(
            // z-score
            tf.tensor1d(values).sub(moments.mean).div(stdDev).dataSync()
        ),
        batchedDatapoints = Batch(
            values.map((x, i) => {
                return {
                    value: normalized[i]
                }
            }),
            window_size
        ),
        outputsValue = [],
        totalInputValues = [],
        batchedInputsValues = batchedDatapoints.map(inputValues => {
            outputsValue.push(inputValues.future);
            totalInputValues.push(inputValues.set[window_size - 1].value);

            return inputValues.set.map(val => val.value);
        }),
        dayIndex = day => batchedInputsValues.length - (dayDatapoints * (daysData - day + 1)) - 1,

        trainInputs = batchedInputsValues.slice(0, dayIndex(7) - dayDatapoints),
        trainOutputs = outputsValue.slice(dayDatapoints, dayIndex(7)),

        predictedTrainInputs = batchedInputsValues.slice(dayIndex(8), dayIndex(8) + dayDatapoints),
        predictedTestInputs = batchedInputsValues.slice(-dayDatapoints),

        actualTestValueOutputs = outputsValue.slice(dayIndex(8) + dayDatapoints, outputsValue.length - 1);

    return {
        // switch this to a closure?

        // training 
        window_size,
        stdDev,
        moments,

        trainInputs,
        trainOutputs,

        // predicting 
        predictedTrainInputs,
        predictedTestInputs,

        actualTestValueOutputs,
        totalInputValues,
        totalDates,
        dayDatapoints,
    }
}