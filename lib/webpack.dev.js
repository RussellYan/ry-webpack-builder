const { HotModuleReplacementPlugin } = require('webpack');
const merge = require('webpack-merge');
const { baseConfig, rd } = require('./webpack.base');

const devConfig = {
  mode: 'development',
  output: {
    path: rd('dist'),
    filename: '[name].js',
  },
  plugins: [
    new HotModuleReplacementPlugin(),
  ],
  // source map 类型
  devtool: 'source-map',
  devServer: {
    contentBase: rd('dist'),
    hot: true,
    port: 9000,
    quiet: true, // friendly-errors-webpack-plugin 配置
    // stats: 'errors-only'
  },
};

module.exports = merge(baseConfig, devConfig);
