var debug = process.env.NODE_ENV !== 'production';
var path = require('path');

var src = '../src/'

module.exports = {
    context: path.join(__dirname),
    devtool: debug ? 'inline-sourcemap' : null,
    entry: {
        popup: src + 'popup/indexPopup.js',
        background: src + 'background/indexBackground.js',
        content: src + 'content/indexContent.js',
        sandbox: src + 'sandbox/src/sandbox.json.js',
    },
    module: {
        rules: require('./rules'),
    },
    output: {
        path: path.resolve(__dirname, '../src/assets/min'),
        filename: '[name].min.js',
        publicPath: 'min' //path.resolve(__dirname, '../src/assets'),
    },
    watch: true,
    cache: false,
    node: {
        fs: "empty"
    },

    plugins: require('./plugins'),
};
