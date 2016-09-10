const join = require('path').join
const webpack = require('webpack')
const { DefinePlugin, ProvidePlugin } = webpack
const externalNodeModules = require('webpack-node-externals')


const babelConfig = {
  babelrc: false,
  cacheDirectory: true,
  presets: ["es2015-webpack", "stage-0", "react"],

  plugins: [
    "add-module-exports",
    "lodash"
  ]
}

module.exports = {
  target: 'node',

  cache: true,

  node: {
    console: true
  },

  entry: {
    bundle: [
      './server/src/global',
      './frontend/src/index.node.js'
    ]
  },

  externals: [
    externalNodeModules()
  ],

  output: {
    path: './frontend/dist',
    filename: 'server.[name].js',
    libraryTarget: 'commonjs',
    publicPath: '/static/'
  },

  plugins: [
    new ProvidePlugin({
      Promise: 'bluebird',
      fetch: 'exports?self.fetch!whatwg-fetch'
    }),

    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      '__SERVER__': true,
      '__BROWSER__': false
    })
  ],

    module: {
      exprContextRegExp: /$^/,
      exprContextCritical: false,
      loaders: [{
        test: /\.js$/,
        loader: 'babel',
        include: [
          join(process.cwd(), 'frontend', 'src')
        ],
        exclude: [
          /node_modules/,
          /dist/
        ],
        query: babelConfig
      },{
        test: /\.json$/,
        loader: 'json'
      }]
    },

    resolve: {
      // modifies the paths we use to satisfy require statements
      modules: [
        'frontend/src',
        'node_modules'
      ],

      // when requiring a module, which package.json fields should webpack use for the main script
      mainFields: [
        'jsnext:main',
        'main'
      ]
    }
}
