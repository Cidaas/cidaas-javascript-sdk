const { merge } = require('webpack-merge');
 const common = require('./webpack.common.js');

 module.exports = merge(common, {
   mode: 'development',
   devtool: 'inline-source-map',
   devServer: {
     contentBase: './build',
   },
   watch: true,
   watchOptions: {
     aggregateTimeout: 500,
     poll: true
   },
 });