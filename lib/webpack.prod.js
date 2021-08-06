const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const merge = require('webpack-merge');
const { baseConfig, rd } = require('./webpack.base');

const prodConfig = {
  mode: 'production',
  output: {
    path: rd('dist'),
    filename: '[name]_[chunkhash:8].js',
  },
  plugins: [
    new MiniCssExtractPlugin({ // 与style-loader是互斥的
      filename: '[name]_[contenthash:8].css',
    }),
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
    }),
  ],
  optimization: {
    // 公共资源代码分包
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /(react|react-dom)/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    minimize: true,
    // 去掉注释
    minimizer: [new TerserPlugin({
      // webpack v4.31.0 对应 TerserPlugin v4.2.3
      extractComments: false,
      terserOptions: {
        // 去掉license相关的注释
        output: {
          comments: false,
        },
        compress: {
          warnings: false,
          // drop_console: true,
          drop_debugger: true,
          // pure_funcs: ['console.log'] //移除console
        },
      },
    })],
  },
  stats: 'errors-only',
};

module.exports = merge(baseConfig, prodConfig);
