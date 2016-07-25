/* eslint-disable */
var WebpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');
var config = require('../frontend/config/webpack.dev.babel');

var server = new WebpackDevServer(webpack(config), {
  // webpack-dev-server options
  publicPath: config.output.publicPath,
  stats: { colors: true },
});

server.listen(8080, "localhost", function() {
  console.log('\nHot server started!');
});
