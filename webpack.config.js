var webpack = require('webpack');
var path = require('path');
var pjson = require('./package.json');
const TerserPlugin = require("terser-webpack-plugin");

var entryPoints = {
  'cidaas_javascript_sdk': ['./src/main/index.js']
};

module.exports = {
  devtool: 'source-map',
  entry: entryPoints,
  output: {
    path: path.join(__dirname, '../build'),
    filename: '[name].min.js',
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js']
  },
  watchOptions: {
    aggregateTimeout: 500,
    poll: true
  },
  watch: false,
  stats: {
    colors: true,
    modules: true,
    reasons: true
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  mode: 'production',
  plugins: [
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.BannerPlugin({
        banner: `[filename] v${pjson.version}\n\nAuthor: ${pjson.author}\nDate: ${new Date().toLocaleString()}\nLicense: MIT\n`, // eslint-disable-line
        raw: false,
        entryOnly: true
      }
    )
  ]
};