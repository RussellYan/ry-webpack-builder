const path = require('path');

process.chdir(path.resolve(__dirname, 'smoke/template'));

describe('builder-webpack test case', () => {
  require('./units/webpack-base-test');
})