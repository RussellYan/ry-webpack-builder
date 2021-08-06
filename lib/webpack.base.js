const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FriendlyLogs = require('friendly-errors-webpack-plugin');

const projectRoot = process.cwd();
const rd = dir => path.resolve(projectRoot, dir);

// 多页面应用打包（需要约定路径规范）
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(rd('./src/*/index.js'));
  entryFiles.map((item) => {
    const match = item.match(/src\/(.*)\/index\.js$/);
    const pathname = rd(match[0]);
    const chunk = match[1];
    entry[chunk] = pathname;
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: rd(`src/${chunk}/index.html`),
        filename: `${chunk}.html`,
        chunks: [chunk],
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false,
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

const baseConfig = {
  entry,
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader, // 与style-loader是互斥的
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({
                  browsers: ['last 2 version', '>1%', 'ios 7'],
                }),
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        // use: 'file-loader'
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
              limit: 5120, // 图片小于5k自动打包成base64
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name]_[hash:8].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    // 每次清理掉打包目标目录
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ['*.LICENSE.txt'],
    }),
    new FriendlyLogs(),
    // 主动捕获错误
    function errorCatchPlugin() {
      this.hooks.done.tap('done', (stats) => {
        const { errors = [] } = stats.compilation;
        if (errors.length && process.argv.indexOf('--watch') === -1) {
          console.log('build error'); // eslint-disable-line
          process.exit(1);
        }
      });
    },
  ].concat(htmlWebpackPlugins),
};

module.exports = {
  baseConfig,
  rd,
};
