
if (typeof window === 'undefined') {
  global.window = {};
}

const fs = require('fs');
const path = require('path');
const express = require('express');
const { renderToString } = require('react-dom/server');
const rd = dir => path.resolve(__dirname, dir);
const SSR = require(rd('../ssrdist/search-server'));
const template = fs.readFileSync(rd('../ssrdist/search.html'), 'utf8');

const server = port => {
  const app = express();
  app.use(express.static(rd('../ssrdist')));
  app.get('/search', (req, res) => {
    const str = renderToString(SSR);
    const html = template.replace('SEARCH_HTML_PLACEHOLDER', str);
    res.status(200).send(html);
  });
  app.listen(port, () => {
    console.log('Server is running on port: ', port);
  })
}

server(process.env.PORT || 3000);

