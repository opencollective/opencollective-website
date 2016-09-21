import webpack, {
  DefinePlugin,
  ProvidePlugin,
  NoErrorsPlugin,
  HotModuleReplacementPlugin,
  DllPlugin,
  DllReferencePlugin,
  IgnorePlugin
} from 'webpack'

import ExtractTextPlugin from 'extract-text-webpack-plugin'

const {
  CommonsChunkPlugin,
  DedupePlugin,
  UglifyJsPlugin
} = webpack.optimize

export default {
  CommonsChunkPlugin,
  DedupePlugin,
  DefinePlugin,
  DllPlugin,
  DllReferencePlugin,
  ExtractTextPlugin,
  HotModuleReplacementPlugin,
  IgnorePlugin,
  NoErrorsPlugin,
  ProvidePlugin,
  UglifyJsPlugin
}
