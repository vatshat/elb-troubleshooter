import * as tf from '@tensorflow/tfjs-node'

const    
    randomValues = Array.from({length: 5}, () => Math.floor(Math.random() * 40));
    
console.time("test1")

const 
    a = tf.tensor1d(randomValues),
    moments = tf.moments(a),
    stdDev = tf.sqrt(moments.variance)
console.timeEnd("test1")

stdDev.print()
 
console.time("test2")
const 
    average = data => data.reduce((sum, value) => sum + value) / data.length,
    standardDeviation = values => Math.sqrt(average(values.map(value => (value - average(values)) ** 2)));
console.timeEnd("test2")

console.log(`stDev ${standardDeviation(randomValues)} random:${randomValues}`)

console.log(
    ...[1,2,3,4,5],
    ...[6,7,8,9],
)