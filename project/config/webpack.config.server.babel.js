/**
 * Webpack Configuration: Target node / commonjs
 *
 * Outputs modules which expect to be run in node.js.  A main difference
 * between the node and browser target is that our module will be able to
 * use nodes / npm module resolution at runtime.  This is accomplished by
 * treating all of the modules in node_modules/ as webpack `externals`
 *
 * See: https://webpack.github.io/docs/library-and-externals.html
 */
import * as loaders from './webpack/loaders'
const { EXPOSE_ENV } = require('./env')

const passThroughNodeModules = require('./webpack/node-module-externals')
const project = require('..')

export default (options = {}, {paths}) => (
  require('@terse/webpack').api()
    .target('node')

    .output({
      path: paths.output,
      filename: '[name].js'
    })

    .externals(
      passThroughNodeModules({
        pkg: require(paths.join('package.json'))
      })
    )

    .externals(project.paths.tools)

    /**
     * Source Map Support in node requires the source-map-support module
    .sourcemap("source-map")
    .plugin("webpack.BannerPlugin", {
      banner: `require("source-map-support").install();`,
      raw: true
    })
     */
     
    /**
     * COMMON LOADERS
     *
     * These files are treated the same for all environments
     */
    .loader('json', '.json')

    // Apply our environment specific configurations
    .when('development', (builder) => development(project, paths, builder))
    .when('production', (builder) => production(project, paths, builder))

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

    // ignore auto-lazy loaded moment-locales
    .plugin('webpack.IgnorePlugin', /^\.\/locale$/, /moment$/)
)

const production = (project, paths, builder) => (
  builder
    .loader('babel', '.js', loaders.scripts.babelLoader({
      exclude: [
        /node_modules/,
        paths.output,
        project.paths.frontend.output
      ],
      include: [
        project.paths.server.src,
        project.paths.frontend.src,
        project.paths.copy.src,
        project.paths.tools
      ]
    }))
)

const development = (project, paths, builder) => (
  builder
    .loader('babel', '.js', loaders.scripts.babelHotLoader({
      hot: (process.argv.indexOf('--hot') >= 0 || process.env.ENABLE_HMR),
      exclude: [
        /node_modules/,
        paths.output
      ],
      include: [
        project.paths.server.src,
        project.paths.frontend.src,
        project.paths.copy.src,
        project.paths.tools
      ]
    }))
)
