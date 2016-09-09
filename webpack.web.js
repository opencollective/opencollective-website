const join = require('path').join
const compact = require('lodash/compact')
const webpack = require('webpack')
const { ProvidePlugin, EnvironmentPlugin } = webpack
const {StatsWriterPlugin} = require('webpack-stats-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const babelConfig = {
  babelrc: false,
  cacheDirectory: true,
  presets: ["es2015", "stage-0", "react", "react-hmre"].map(i => require.resolve(`babel-preset-${i}`)),
  plugins: [
    "add-module-exports",
    "lodash"
  ]
}

module.exports = function(environment, options) {
  return buildConfig(environment, options)
}

/**
 * @param {Array} options.exposeVars - a list of ENV vars webpack can safely expose
 * @param {String} options.outputPath - where to store the output
 * @param {String} options.publicPath - the base URL assets are served from e.g. /static/
 */
function buildConfig(environment = process.env.NODE_ENV || 'development', options = {}) {
  options.env = environment

  const config = generateBase(options)

  switch (environment) {
    case 'development':
    default:
      return normalize(
        development(config, options)
      )
  }
}

function generateBase(options = {}) {
  return {
    context: process.cwd(),
    devtool: 'eval',
    target: 'web',
    entry: {
      bundle: ['./frontend/src/index.web.js']
    },
    output: {
      path: options.outputPath || join(process.cwd(), 'frontend', 'dist'),
      filename: '[name].js',
      // public path tells our assets which path they will be served from
      publicPath: options.publicPath || '/static/'
    },

    externals: [],

    plugins: [
      new ProvidePlugin({
        Promise: 'bluebird',
        fetch: 'exports?self.fetch!whatwg-fetch'
      }),

      new CopyPlugin([{
        from: join(process.cwd(), 'frontend/src/assets')
      }]),

      exposeEnvironmentVarsPlugin([
        'NODE_ENV',
        ...(options.exposeVars || [])
      ])
    ],

    module: {
      exprContextRegExp: /$^/,
      exprContextCritical: false,

      loaders: [ {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader'
      }, {
        test: /\.(jpg|png|gif)$/,
        loaders: [
          'file-loader',
          'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
        ]
      }, {
        test: /\.json$/,
        loader: 'json'
      }, {
        test: /numbro\/numbro/,
        loader: 'imports?require=>false'
      }]
    },

    resolve: {
      alias: {
        'joi': 'joi-browser'
      },

      // modifies the paths we use to satisfy require statements
      modules: [
        join(process.cwd(), 'frontend', 'src'),
        // normal commonjs behavior e.g. require('react')
        join(process.cwd(), 'node_modules')
      ],

      // when requiring a module, which package.json fields should webpack use for the main script
      mainFields: [
        'jsnext:main',
        'main'
      ]
    }
  }
}

function development (config, options = {}) {
  addBabelLoader(config)
  addStyleLoader(config)

  // HMR is enabled by default. Can be opted out of via CLI flag or env variable
  if (options.hot !== false && !process.env.DISABLE_HMR) {
    addHotModuleReloading(config)
  }

  // generate a manifest of the assets with their chunk names / hashes
  addManifestGenerator(config, 'web.development.manifest.json')

  // the stats plugin generates valuable metadata about our build
  addStatsPlugin(config)

  return config
}

function addStyleLoader(config, options = {}) {
  const cssNext = require('postcss-cssnext');
  const cssImport = require('postcss-import');
  const cssNested = require('postcss-nested');

  config.postcss = () => {
    return [
      cssNext,
      cssImport,
      cssNested
    ]
  }

  const styleExtract = new ExtractTextPlugin('frontend/src/css/[name].css')

  config.module.loaders.push({
    test: /\.css$/,
    loader: styleExtract.extract(['css','postcss']) ,
    exclude:[
      /node_modules/
    ]
  }, {
    test: /\.css$/,
    loader: 'style!css',
    include:[
      join(process.cwd(), 'node_modules')
    ]
  })

  config.plugins.push( styleExtract )
}

function addBabelLoader(config, options = {}) {
  config.module.loaders.unshift({
    test: /\.js$/,
    loader: 'babel',
    query: babelConfig,
    exclude: [
      /node_modules/,
      /dist/
    ],
    include: [
      join(process.cwd(), 'frontend', 'src')
    ]
  })
}

function addHotModuleReloading(config) {
  //config.output.publicPath = 'http://localhost:3000/static/'

  config.entry.bundle.unshift(
    'webpack-hot-middleware/client'
  )

  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  )
}

function addManifestGenerator(config, filename) {
  config.plugins.push(
    new StatsWriterPlugin({
      filename,
      fields: [
        'assetsByChunkName',
        'hash',
        'version',
        'assets'
      ]
    })
  )
}

function addStatsPlugin(config, fields) {
  const defaultFields = [
    'errors',
    'warnings',
    'version',
    'hash',
    'publicPath',
    'assetsByChunkName',
    'assets',
    'entrypoints',
    'chunks',
    'modules',
    'filteredModules',
    'children'
  ]

  config.plugins.push(new StatsWriterPlugin({
    // saves relative to the output path
    filename: 'stats.web.development.json',
    fields: fields || defaultFields
  }))
}

function normalize (custom = {}) {
  custom.plugins = compact(custom.plugins || [])

  if (custom.module && custom.module.loaders) {
    custom.module.loaders = compact(custom.module.loaders)
  }

  if (custom.module && custom.module.preLoaders) {
    custom.module.preLoaders = compact(custom.module.preLoaders)
  }

  return custom
}

function exposeEnvironmentVarsPlugin(variableNames) {
    return new EnvironmentPlugin([
      'NODE_ENV',
      ...variableNames
    ])
}
