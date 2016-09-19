const loaders = require('./webpack/loaders')
const plugins = require('./webpack/plugins')

const { EXPOSE_ENV } = require('./env')

export default (options = {}, {project, paths}) => (
  require('@terse/webpack').api()
    .target('web')

    .output({
      filename: '[name].js',
      path: paths.output
    })

    .modules(paths.src)


    /**
     * COMMON LOADERS
     *
     * These files are treated the same for all environments
     */
    .loader('json', '.json')
    .loader('yaml', ['.yml','.yaml'], {
      loader: 'json!yaml'
    })


    // Load vendor CSS from node_modules, no need to process with postcss
    .loader('css', '.css', {
      loader: ['style', 'css'],
      include: [
        /node_modules/
      ]
    })

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
      __SERVER__: false,
      __BROWSER__: true
    })

    .plugin('webpack.NamedModulesPlugin')

    /**
     * Include polyfills for fetch and use bluebird for Promise
     */
    .plugin('webpack.ProvidePlugin', {
      Promise: 'bluebird',
      fetch: 'exports?window.fetch!whatwg-fetch',
      React: 'react' // make react available anywhere
    })
)

const production = (project, paths, builder) => {
  const { loader } = plugins.helpers.styleExtractor({name:'[name].css'})

  const prod = builder
    .loader('babel', '.js', loaders.scripts.babelLoader({
      include: [paths.src],
      exclude: [/node_modules/]
    }))

    // We hash the files in production as a cache clearing mechanism
    .output({
      filename: '[name].[chunkhash].js',
      chunkFilename: '[name].[chunkhash].chunk.js'
    })

    .loader('extract-css', '.css', loaders.css.extractingLoader({
      loader,
      include: [paths.src],
      exclude: [/node_modules/]
    }))

    .loader('file', ['.eot', '.svg', '.ttf', '.woff', '.woff2'], {
      loader: 'url-loader?name=[name].[hash].[ext]&limit=8192',
      include: [
        project.paths.frontend.join('src/assets')
      ],
      exclude: [/node_modules/]
    })

    // Run our images through the image optimizing loaders
    .loader('images', ['.jpg','.png','.gif'], {
      include: [paths.assets],
      loader: loaders.assets.imageLoader('production', {
        progressive:true,
        optimizationLevel: 7,
        interlaced: false,
        pngquant:{
          quality: "65-90",
          speed: 4
        }
      })
    })

    .plugin('webpack.optimize.DedupePlugin')
    .plugin('webpack.optimize.CommonsChunkPlugin', {
      name: 'vendor',
      children: true,
      minChunks: 2
    })

    .plugin('webpack.optimize.UglifyJsPlugin', {
      compress: {
        screw_ie8: true, // React doesn't support IE8
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    })

    return prod
}

const development = (project, paths, builder) => {
  const dev = builder
    .loader('babel', '.js', loaders.scripts.babelHotLoader({
      hot: (process.argv.indexOf('--hot') >= 0 || process.env.ENABLE_HMR),
      include: [paths.src],
      exclude: [/node_modules/]
    }))

    // This lets us require css in javascript, injecting them into our head as style tags
    .loader('css', '.css', {
      loaders: ['style', 'css', 'postcss'],
      include: [
        paths.join('src', 'css')
      ],
      exclude:[/node_modules/]
    })

    .loader('file', ['.eot', '.svg', '.ttf', '.woff', '.woff2'], {
      loader: 'url-loader?name=[name].[ext]&limit=8192',
      include: [
        project.paths.frontend.join('src/assets')
      ],
      exclude: [/node_modules/]
    })

    .loader('images', ['.jpg','.png','.gif'], {
      include: [paths.assets],
      loader: loaders.assets.imageLoader('development')
    })

  return dev
}
