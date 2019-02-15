// https://medium.com/@jontorrado/working-with-webpack-4-es6-postcss-with-preset-env-and-more-93b3d77db7b2

var webpack = require('webpack');
var path = require('path');

const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

var customPlugins = process.env.NODE_ENV !== 'production' ? 
    [] 
    : 
    [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
                mangle: false,
                sourcemap: true,
                cache: true,
                parallel: true,
            },
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('development')
            })
        ),
    ]

customPlugins = [
    ...customPlugins,
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        Util: 'exports-loader?Util!bootstrap/js/dist/util'
    }),
    new ExtractTextWebpackPlugin("[name].css"),/* 
    new HtmlWebpackPlugin({
        filename: '../index.html', //relative to root of the application
        template: path.resolve(__dirname, '../src/content/static/content.html'),
        title: 'ELB Troubleshooter',
        inject: false,
    }),
    new HtmlWebpackPlugin({
        filename: '../popup.html', //relative to root of the application
        template: path.resolve(__dirname, '../src/popup/popup.html'),
        title: 'Pop-up ',
        inject: false,
    }) */
]

 module.exports = customPlugins;