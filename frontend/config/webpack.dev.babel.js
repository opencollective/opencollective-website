var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',       // Emit a source map for easier debugging
  entry: [
    'webpack-dev-server/client?http://localhost:8080', // Inject hot reloading into the bundle
    'webpack/hot/only-dev-server',
    path.join(__dirname, '../src/client.js'),    // Start with src/client.js
  ],
  output: {                                      // Bundle everything into dist/bundle.js
    path: path.resolve(__dirname, '../dist/js'),
    publicPath: 'http://localhost:8080/js/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/^(net|dns)$/, path.resolve(__dirname, 'emptyfile.js')),
    new webpack.HotModuleReplacementPlugin(),    // Start the webpack hot reloading server
    new webpack.DefinePlugin({                   // Tell webpack if we're in production or not
      'process.env': {
        NODE_ENV: JSON.stringify(
          process.env.NODE_ENV
        ),
      },
    }),
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,                             // Transform all .js and .jsx files required somewhere with Babel
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: ['react-hmre'],                  // Tell babel that we want to hot-reload
      },
    }, {
      test: /\.json$/,
      loader: 'json',
    }, {
      test: /numbro\/numbro/,
      loader: "imports?require=>false",
    }],
  },
  target: 'web',                                 // Handle global variables of the web, e.g. window
  progress: true,
};
