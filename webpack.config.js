var debug = process.env.NODE_ENV !== 'production';
var webpack = require('webpack');
var path = require('path');

module.exports = {
    context: path.join(__dirname),
    devtool: debug ? 'inline-sourcemap' : null,
    entry: {
        popup: './src/popup/indexPopup.js',
        background: './src/background/indexBackground.js',
        content: './src/content/indexContent.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    }
                ]
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'env', 'stage-0'],
                }
            }
        ]
    },
    output: {
        path: __dirname + '/src/assets/js',
        filename: '[name].min.js',
        publicPath: '/src/assets'
    },
    watch: true,
    node: {
        fs: "empty"
    },

    plugins: debug ? [] : [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            mangle: false,
            sourcemap: false
        },
        new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('development')
            })
        ),
    ],
};
