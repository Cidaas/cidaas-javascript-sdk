const path = require('path');
const pjson = require('./package.json');
var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var entryPoints = {
  'cidaas_javascript_sdk': './src/main/index.js'
};

module.exports = {
   entry: entryPoints,
   plugins: [
     new HtmlWebpackPlugin({
       title: 'Production',
     }),
     new webpack.BannerPlugin({
      banner: `${pjson.name} v${pjson.version}\n\nAuthor: ${pjson.author}\nDate: ${new Date().toLocaleString()}\nLicense: MIT\n`, // eslint-disable-line
      raw: false,
      entryOnly: true
    }
  )
   ],
   output: {
     path: path.resolve(__dirname, './build'),
     filename: '[name].min.js',
     library: '[name]',
     libraryTarget: 'umd',
     umdNamedDefine: true,
     clean: true,
   },
   stats: {
    colors: true,
    modules: true,
    reasons: true
  },
 };