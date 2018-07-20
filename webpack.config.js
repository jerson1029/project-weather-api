const path = require('path');
const serverlessWebpack = require('serverless-webpack');

module.exports = {
  entry: serverlessWebpack.lib.entries,
  target: 'node',
  devtool: 'source-map',
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'json-loader',
        include: __dirname,
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: __dirname,
        exclude: /node_modules/,
      },
    ],
  },
  externals: [
    'aws-sdk',
  ],
};
