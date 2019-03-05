import consoleLog from './consoleLog'
import * as tf from '@tensorflow/tfjs-node';

const loadModel = tf.loadModel("file://../tfjs-model/model.json");