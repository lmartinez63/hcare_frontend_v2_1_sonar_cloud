'use strict'

const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const Fiber = require('fibers');

const HOST = 'localhost'
const PORT = 8081

module.exports = merge(baseConfig, {
  mode: 'development',

  devServer: {
    clientLogLevel: 'warning',
    hot: true,
    contentBase: 'dist',
    compress: true,
    host: HOST,
    port: PORT,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    publicPath: '/',
//    quiet: true,
    historyApiFallback: true
  },

  module: {
    rules: [{
      test: /\.scss$/,
      use: [{
        loader: "style-loader"
      }, {
        loader: "css-loader"
      }, {
        loader: "sass-loader",
        options: {
          implementation: require("sass"),
          fiber: Fiber
        }
      }]
    }, {
      test: /\.(css)$/,
      use: [
        'vue-style-loader',
        'css-loader'
      ]
    }, {
      test: /\.styl(us)?$/,
      use: [
        'vue-style-loader',
        'css-loader',
        'stylus-loader'
      ]
    }]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})
