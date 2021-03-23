const { merge } = require('webpack-merge');
var webpack = require('webpack');
 const common = require('./webpack.common.js');
 const CompressionPlugin = require("compression-webpack-plugin");
 module.exports = merge(common, {
   mode: 'production',
   plugins: [
    new webpack.optimize.AggressiveMergingPlugin(),
    new CompressionPlugin()
   ]
 });