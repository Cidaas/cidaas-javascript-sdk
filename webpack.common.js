const path = require('path');
const pjson = require('./package.json');
var webpack = require('webpack');

var entryPoints = {
  'cidaas-javascript-sdk': './src/main/index.js'
};

module.exports = {
   entry: entryPoints,
   plugins: [
     new webpack.BannerPlugin({
      banner: `${pjson.name} v${pjson.version}\n\nAuthor: ${pjson.author}\nDate: ${new Date().toLocaleString()}\nLicense: MIT\n`, // eslint-disable-line
      raw: false,
      entryOnly: true
    }
  )
   ],
   output: {
     path: path.resolve(__dirname, './dist'),
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