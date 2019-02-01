var path = require('path');
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");

const glyphicon = 'file-loader?name=[name].[ext]&outputPath=./glyphicons/&publicPath=/min/glyphicons/'

module.exports = [
            {
                test: /\.jsx.css$/,
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
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?limit=10000&mimetype=application/font-woff'
            },            
            {
                test: /\.woff$/,
                use: glyphicon + '&mimetype=application/font-woff'
            }, 
            {
                test: /\.woff2$/,
                use: glyphicon + '&mimetype=application/font-woff2'
            }, 
            {
                test: /\.ttf$/,
                use: glyphicon + '&mimetype=application/font-sfn'
            }, 
            {
                test: /\.eot$/,
                use: glyphicon 
            }, 
            {
                test: /\.svg$/,
                use: glyphicon + '&mimetype=image/svg+xml'
            },
            {
                test: /\.(jpg|png)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: '../img',
                        publicPath: '/img/',
                    },
                }],
            }, 
            {
                test: /manifest\.json$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: '../',
                    },
                }],
            }, 
            {
                test: /react-bootstrap-table-all\.min\.css$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: '../min/',
                        publicPath: '/min/'
                    },
                }],
            },
            {
                //standard css in case scss doesn't work for whatever reason
                test: /\.min.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    use: "css-loader",
                }),
            },
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname, '../src/'),
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'env', 'stage-0'],
                }
            },
            {
                test: /\.(scss)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            }
        ]