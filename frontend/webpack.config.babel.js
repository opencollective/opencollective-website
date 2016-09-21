import project from '../project' // eslint-disable-line
import postcss from '../project/config/postcss'
import plugins from '../project/config/webpack/plugins/core'
import mapValues from 'lodash/mapValues'

// HACK Some webpack plugins rely on process.cwd() / some resolve relative to the config file.
process.chdir(__dirname)

// Entry point when using Webpack CLI or webpack-dev-server CLI
export default (env, options = {}) => {
  const builder = options.target === 'node'
    ? nodeBuilder(options)
    : webBuilder(options)

  builder.context(__dirname)

  const config = builder.getConfig()

  // HACK. Not sure how to add this with the @terse/webpack DSL
  if (process.env.NODE_ENV === 'production' && options.target !== 'node') {
    config.plugins.push( new plugins.ExtractTextPlugin('[name].css') )
  }

  return {
    postcss: postcss,
    ...config,
    context: __dirname,
    devServer: {
      info: false,
      stats: 'normal'
    }
  }
}

export const webBuilder = () => (
  project.getWebpackBase('web', {
    paths: project.paths.frontend
  })

  .entry(prepare({
    bundle: 'src/index.web.js',

    // We may need to use extract text loader here in development if we want the css to be output as a file
    // however currently i don't think that would be hot reloadable. the downside of not doing it is the
    // initial page load in dev does not have CSS in the head tag; only when the JS is loaded 
    widget: 'src/css/widget.css',
    main: 'src/css/main.css'
  }))

  .output({
    path: project.paths.frontend.output,
    filename: '[name].js',
    publicPath: '/static/'
  })

  .alias('joi', 'joi-browser')

  // ignore auto-lazy loaded moment-locales
  .plugin('webpack.IgnorePlugin', /^\.\/locale$/, /moment$/)

  .when('development', (builder) => builder.plugin('webpack.NoErrorsPlugin'))

)

export const nodeBuilder = () => (
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
