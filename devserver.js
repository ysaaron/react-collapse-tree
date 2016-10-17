let webpackDevServer = require('webpack-dev-server');
let webpack = require('webpack');
let path = require('path');
let express = require('express');
let request = require('request');
let webpackDevMiddleware = require('webpack-dev-middleware');
let webpackHotMiddleware = require('webpack-hot-middleware');

const PORT = process.env.PORT || 3000;
let config = require('./webpack.config.js');
let compiler = webpack(config);
let server = express();
let router = express.Router();

router.get('/*', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

server.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  headers: { 'Access-Control-Allow-Origin': '*' }
}));
server.use(webpackHotMiddleware(compiler));
server.use('/public', express.static('public'));
server.use(router);

server.listen(PORT, function (err) {
    if(err) {
      console.log(err);
    } else {
      console.info(`==> Listening on port ${PORT}. Open up http://localhost:${PORT}/ in your browser.`, PORT, PORT);
    }
})
