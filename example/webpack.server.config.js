const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const p = process.env.NODE_ENV === 'production'

/**
 * @see http://jlongster.com/Backend-Apps-with-Webpack--Part-I
 */
const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  target: 'node',
  devtool: 'source-map',
  entry: path.join(__dirname, 'server/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'server.js',
    publicPath: '/'
  },
  externals: nodeModules,
  node: {
    console: true,
    __filename: true,
    __dirname: true
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js?$/,
        loader: 'standard-loader',
        exclude: /node_modules|app/,
        options: {
          parser: 'babel-eslint'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: [
          path.join(__dirname, 'server'),
          path.join(__dirname, 'app')
        ],
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
  }
}
