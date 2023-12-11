
const path = require('path');
const pjson = require('./package.json')
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

var entryPoints = {
  'cidaas-javascript-sdk': './src/main/index.ts'
};

module.exports = {
  entry: entryPoints,
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `${pjson.name} v${pjson.version}\n\nAuthor: ${pjson.author}\nDate: ${new Date().toLocaleString()}\nLicense: MIT\n`, // eslint-disable-line
      raw: false,
      entryOnly: true
    }
    )
  ],
  output: {
    path: path.resolve(__dirname, './minified'),
    filename: '[name].min.js',
    library: 'CidaasSDK',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    clean: true,
    globalObject: 'this'
  },
  stats: {
    colors: true,
    modules: true,
    reasons: true
  },
};
