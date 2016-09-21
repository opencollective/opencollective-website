const ExtractTextPlugin = require('extract-text-webpack-plugin')

export const extractingLoader = (options = {}) => ({
  test: /\.css/,
  loaders: ExtractTextPlugin.extract(options.loaders || ['css','postcss']),
  exclude: [
    /node_modules/
  ].concat(options.exclude)
})
