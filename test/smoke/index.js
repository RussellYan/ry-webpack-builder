const path = require('path');
const webpack = require('webpack');
const rimraf = require('rimraf');
const Mocha = require('mocha');

const mocha = new Mocha({
  timeout: '10000'
});
process.chdir(path.resolve(__dirname, 'template'));
rimraf('./dist', () => {
  console.log('=== begin.');
  const prodConfig = require('../../lib/webpack.prod.js');
  webpack(prodConfig, (err, stats) => {
    if (err) {
      console.error(err);
      process.exit(2);
    }
    console.log(stats.toString({
      colors: true,
      modules: false,
      children: false
    }));
    console.log('webpack build success, begin run test.');
    mocha.addFile(path.resolve(__dirname, 'html-test.js'));
    mocha.addFile(path.resolve(__dirname, 'css-js-test.js'));
    mocha.run();
  });
})