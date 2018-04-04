var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var plugins = [
    new ProgressBarPlugin(),
    new HtmlWebpackPlugin({template: './client/index.html'})
];

if (process.env.ENV === 'production') {
    plugins.push(new UglifyJsPlugin());
}

module.exports = {
    watch: true,
    entry: './client/main.ts',
    output: {
        path: './dist',
        filename: 'app.bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: ['ts', 'angular2-template-loader?keppUrl=true']
            }, {
                test: /\.(html|css)$/,
                loader: 'raw-loader'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.ts']
    },
    plugins: plugins
};