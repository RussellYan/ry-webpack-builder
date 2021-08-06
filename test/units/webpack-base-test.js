const path = require('path');
const assert = require('assert');

describe('webpack.base.js test case', () => {
  const { baseConfig, rd } = require('../../lib/webpack.base');
  // console.log('baseConfig ==> ', baseConfig);
  const entryPath = (name) => path.resolve(__dirname, `../smoke/template/src/${name}/index.js`);
  it('entry', () => {
    assert.strictEqual(baseConfig.entry.main, entryPath('main'));
    assert.strictEqual(baseConfig.entry.search, entryPath('search'));
    assert.strictEqual(typeof rd, 'function');
  });
});