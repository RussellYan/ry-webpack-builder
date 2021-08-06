const glob = require('glob-all');

describe('Check generated html files', () => {
  it('should generate html files', (done) => {
    const files = glob.sync([
      './dist/main.html',
      './dist/search.html'
    ]);
    if (files.length) {
      done();
    } else {
      throw new Error('no html files generated');
    }
  })
});