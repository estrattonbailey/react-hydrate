const webpack = require('webpack')
const path = require('path')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const p = process.env.NODE_ENV === 'production'

module.exports = {
  target: 'web',
  devtool: 'source-map',
  entry: path.join(__dirname, 'app/index.js'),
  output: {
    path: path.join(__dirname, 'dist/public'),
    filename: 'index.js',
    publicPath: '/'
  },
  externals: '',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js?$/,
        loader: 'standard-loader',
        exclude: /node_modules/,
        options: {
          parser: 'babel-eslint'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: path.join(__dirname, 'app'),
        loaders: ['babel-loader']
      },
    ]
  },
  resolve: {
    alias: {
      Components: path.join(__dirname, 'app/components'),
      Pages: path.join(__dirname, 'app/pages'),
      Icons: path.join(__dirname, 'app/icons'),
      Util: path.join(__dirname, 'app/util'),
      Root: path.join(__dirname, 'app/')
    }
  },
  plugins: p ? [
    new LodashModuleReplacementPlugin,
    new webpack.optimize.OccurrenceOrderPlugin()
  ] : [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    hot: true,
    contentBase: path.join(__dirname, 'dist/public'),
    publicPath: '/',
    compress: true
  }
}
