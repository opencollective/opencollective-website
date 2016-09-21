import project from '../project' // eslint-disable-line
import postcss from '../project/config/postcss'
import plugins from '../project/config/webpack/plugins/core'
import mapValues from 'lodash/mapValues'

// DISABLED for now, provides a nicer view of the webpack build status
// import DashboardPlugin from 'webpack-dashboard/plugin'

// HACK Some webpack plugins rely on process.cwd() / some resolve relative to the config file.
process.chdir(__dirname)

const paths = project.paths
const { frontend } = paths

// Entry point when using Webpack CLI or webpack-dev-server CLI
export default (env, options = {}) => {
  if (env === 'dll') {
    return dllBundler(env, options)
  }

  const builder = options.target === 'node'
    ? nodeBuilder(env, options)
    : webBuilder(env, options)

  builder.context(__dirname)

  if (process.env.USE_ESLINT) {
    // Run everything through eslint first
    builder.preLoader('eslint', '.js', {
      include: [frontend.src],
      exclude: [/node_modules/],
      loader: 'eslint'
    })
  }

  const config = builder.getConfig()

  // HACK. Not sure how to add this with the @terse/webpack DSL
  if (process.env.NODE_ENV === 'production' && options.target !== 'node') {
    config.plugins.push( new plugins.ExtractTextPlugin('css/[name].css') )
  }

  config.plugins.push(saveManifest)

  // config.plugins.push(new DashboardPlugin())

  return {
    postcss: postcss,
    ...config,
    context: __dirname,
    devServer: {
      info: false,
      stats: 'normal',
      headers: { "Access-Control-Allow-Origin": "*" }
    }
  }
}

export const webBuilder = (env, options) => ( // eslint-disable-line
  project.getWebpackBase('web', {
    paths: project.paths.frontend
  })

  .entry({
    bundle: project.paths.frontend.join('src/index.web.js'),
    widget: project.paths.frontend.join('src/components/Widget.js')
  }, __dirname)

  .output({
    path: project.paths.frontend.output,
    filename: 'js/[name].js',
    publicPath: '/static/'
  })

  .alias('joi', 'joi-browser')

  /**
   * TODO: Review this logic
   * We don't need to copy over the assets which are referenced
   * in our CSS. Any assets or images referenced in react can be
   * required, and a URL will be returned references that file in the build.
   * Files required this way will be hashed into the build automatically by webpack
   */
  .plugin('copy-webpack-plugin', [{
    from: frontend.join('src/assets/robots.txt'),
    to: frontend.join('dist')
  }, {
    from: frontend.join('src/assets/images/favicon.ico.png'),
    to: frontend.join('dist/images')
  }])

  // ignore auto-lazy loaded moment-locales
  .plugin('webpack.IgnorePlugin', /^\.\/locale$/, /moment$/)

  .when('development', (builder) => builder
    .plugin('webpack.NoErrorsPlugin')
  )

)

export const nodeBuilder = (env, options) => ( // eslint-disable-line
   project.getWebpackBase('node', {
     paths: project.paths.frontend
   })

  .entry(prepare({
    middleware: 'src/index.node.js',
    renderer: 'src/renderers/node.js',
    store: 'src/store/node.js',
    widget: 'src/components/Widget.js'
  }))

  .output({
    path: project.paths.frontend.output,
    filename: 'universal/[name].js',
    publicPath: '/static/',
    libraryTarget: 'commonjs2'
  })

  /**
   * This makes all of the server side renderer files think they are in a browser
   */
  .plugin("webpack.BannerPlugin", {
    banner:`
      var jsdom = require('jsdom').jsdom;

      global.document = jsdom('');
      global.window = document.defaultView;
      Object.keys(document.defaultView).forEach((property) => {
        if (typeof global[property] === 'undefined') {
          global[property] = document.defaultView[property];
        }
      });

      global.navigator = {
        userAgent: 'node.js'
      };
    `,
    raw: true,
    entryOnly: true
  })
)


/*
  So that webpack can inject the hot middleware runtimes
  etc, we want to pass it an array. Also to facilitate being
  able to run this script from wherever i pass it an absolute path
 */
const prepare = (entryPoints) => (
  mapValues(entryPoints, (req) => (
    typeof req === 'string' ? [abs(req)] : abs(req)
  ))
)

const abs = (p) => project.paths.frontend.join(p)

const saveManifest = {
  apply: function(compiler) {
    compiler.plugin('done', (stats) => {
      const json = stats.toJson()
      const modules = json.modules.filter(mod => mod.assets.length > 0)
        .map(mod => ({
          id: mod.id,
          name: mod.name,
          asset: mod.assets.shift()
        }))

      project.fsx.outputJsonSync(`${compiler.outputPath}/assets-manifest.json`, modules)
    })
  }
}

const dllBundler = () => {

}
