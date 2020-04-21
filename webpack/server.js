const _ = require('lodash')
const path = require('path')
const slsw = require('serverless-webpack')
const webpack = require('webpack')
const WebpackNodeExternalsPlugin = require('webpack-node-externals')

const CWD = process.cwd()
const BUILD = path.resolve(CWD, 'build/server')
const SRC = path.resolve(CWD, 'src/server')
const PRODUCTION = process.env.NODE_ENV === 'production'

const plugins = [
  new webpack.NoEmitOnErrorsPlugin()
]

module.exports = {
  context: SRC,
  entry: _.mapValues(slsw.lib.entries, (entry) => {
    return ['babel-polyfill', `./${path.basename(entry)}`]
  }),
  devtool: 'source-map',
  externals: [WebpackNodeExternalsPlugin({
    whitelist: [/\.yml/]
  })],
  module: {
    rules: [{
      test: /\.html$/,
      use: ['html-loader']
    }, {
      exclude: [/node_modules/, /voice-service/],
      test: /\.json$/,
      use: ['json-loader']
    }, {
      exclude: /node_modules/,
      test: /\.js$/,
      use: ['babel-loader']
    }, {
      test: /\.yml$/,
      use: ['json-loader', 'yaml-loader']
    }, {
      test: /\.sql$/,
      use: 'raw-loader'
    }]
  },
  output: {
    filename: '[name].js',
    path: BUILD,
    libraryTarget: 'umd'
  },
  mode: PRODUCTION ? 'production' : 'development',
  resolve: {
    alias: {
      base: process.cwd(),
      database: `${SRC}/database`,
      auth: `${SRC}/auth`,
      jovo_config: path.resolve(CWD, 'config.js')
    }
  },
  plugins: plugins,
  target: 'node'
}
