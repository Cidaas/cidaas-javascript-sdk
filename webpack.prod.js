const { merge } = require('webpack-merge');
var webpack = require('webpack');
 const common = require('./webpack.common.js');

 module.exports = merge(common, {
   mode: 'production',
   plugins: [
    new webpack.optimize.AggressiveMergingPlugin()
   ]
 });