const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        weather: ['babel-polyfill', './src/handlers/getWeather/handler.js'],
    },
    target: 'node',
    output: {
        libraryTarget: 'commonjs',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js',
    },
    plugins: [
        new webpack.DefinePlugin({ 'global.GENTLY': false }),
    ],
    module: {
        loaders: [
            {
                test: /\.json$/,
                loader: 'json-loader',
            },
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                include: __dirname,
                exclude: /node_modules/,
            },
        ],
    },
    externals: [
        'aws-sdk',
    ],
};