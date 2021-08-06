const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const merge = require('webpack-merge');
const { baseConfig, rd } = require('./webpack.base');

// 多页面应用打包（需要约定路径规范）
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(rd('./src/*/index-server.js'));
  entryFiles.map((item) => {
    const match = item.match(/src\/(.*)\/index-server\.js$/);
    const pathname = rd(match[0]);
    const chunk = match[1];
    entry[chunk] = pathname;
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: rd(`src/${chunk}/index.html`),
        filename: `${chunk}.html`,
        chunks: ['vendors', chunk],
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
        },
      }),
    );
    return item;
  });
  return {
    entry,
    htmlWebpackPlugins,
  };
};
const { entry, htmlWebpackPlugins } = setMPA();
const ssrConfig = {
  mode: 'production',
  entry,
  output: {
    filename: '[name]-server.js',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /.css$/,
        use: 'ignore-loader',
      },
      {
        test: /.less$/,
        use: 'ignore-loader',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ // 与style-loader是互斥的
      filename: '[name]_[contenthash:8].css',
    }),
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
    }),
  ].concat(htmlWebpackPlugins),
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
};

module.exports = merge(baseConfig, ssrConfig);
