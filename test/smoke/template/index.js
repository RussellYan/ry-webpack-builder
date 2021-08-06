const isDev = process.env.NODE_ENV !== 'production';
module.exports = require(`./lib/large-number${isDev ? '' : '.min'}.js`);
