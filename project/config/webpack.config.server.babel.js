const project = require('..')
const loaders = require('./webpack/loaders')
const passThroughNodeModules = require('./webpack/node-module-externals')
const { EXPOSE_ENV } = require('./env')
const wantsHMR = process.env.ENABLE_HMR || process.argv.indexOf('--hot')

export default (options = {}, {paths}) => (
  require('@terse/webpack').api()
    .target('node')

    .output({
      path: paths.output,
      filename: '[name].js'
    })

    // File Loaders
    .loader('json', '.json')
    .loader('yml', ['.yml','.yaml'], {
      loader: 'json!yaml'
    })

    // Tell webpack not to bundle our package dependencies
    .externals(passThroughNodeModules({
      pkg: require(project.paths.join('package.json'))
    }))

    // Also don't bundle any of our sibling projects
    .externals(project.paths.frontend.context)

    // Tells webpack to leave these alone
    .node({
      __dirname: false,
      __filename: false,
      process: false,
      console: false
    })

    /**
     * Expose environment vars such as NODE_ENV as process.env.NODE_ENV in our build
     */
    .plugin('webpack.DefinePlugin', EXPOSE_ENV)

    /**
     * Define some variables automatically in our build
     */
    .plugin('webpack.DefinePlugin', {
      __SERVER__: true,
      __BROWSER__: false
    })

    /**
     * Include polyfills for fetch and use bluebird for Promise
     */
    .plugin('webpack.ProvidePlugin', {
      Promise: 'bluebird'
    })

    .plugin('webpack.NamedModulesPlugin')

    // Make react available to everything
    .plugin('webpack.ProvidePlugin', {
      React: 'react'
    })

    // ignore auto-lazy loaded moment-locales
    .plugin('webpack.IgnorePlugin', /^\.\/locale$/, /moment$/)

     // Source Map Support in node requires the source-map-support module
    .sourcemap("source-map")
    .plugin("webpack.BannerPlugin", {
      banner: `require("source-map-support").install();`,
      raw: true
    })

    .when('production', (builder) => (builder
      .loader('babel', '.js', loaders.scripts.babelLoader({
        exclude: [
          /node_modules/,
          paths.output,
          project.paths.frontend.output
        ],
        include: [
          project.paths.server.src,
          project.paths.frontend.src
        ]
      }))
    ))

    // In development we use a few different babel-presets and babel-loader options
    .when('development', (builder) => (builder
      .loader('babel', '.js', loaders.scripts.babelHotLoader({
        hot: wantsHMR,
        exclude: [
          /node_modules/,
          paths.output,
          project.paths.frontend.output
        ],
        include: [
          project.paths.server.src,
          project.paths.frontend.src
        ]
      }))
    ))
)
