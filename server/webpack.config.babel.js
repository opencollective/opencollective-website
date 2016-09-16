import project from '../project'
import mapValues from 'lodash/mapValues'

// HACK Some webpack plugins rely on process.cwd() / some resolve relative to the config file.
if (process.argv[1].match(/webpack$/) && process.cwd() !== __dirname) {
  process.chdir(__dirname)
}

const { server } = project.paths

export default () => {
  const builder = project.getWebpackBase('server')

  .target('node')

  .context(__dirname)

  .entry(prepare({
    index: 'src/index.js'
  }))

  .output({
    publicPath: '/static/'
  })

  // TELL Webpack not to touch this
  .node({
    __dirname: false,
    __filename: false,
    process: false,
    console: false
  })

  .modules(__dirname)
  .modules(project.paths.server.src)
  .modules(project.paths.frontend.src)

  // Don't bundle any of these projects as local dependencies
  .externals(project.paths.frontend.context)
  .externals(project.paths.copy.context)

  .when('development',
    (builder) => builder
      .plugin('webpack.NamedModulesPlugin')
      .plugin('webpack.NoErrorsPlugin')
  )

  const config = builder.getConfig()

  return {
    ...config,
    module: {
      ...config.module,
      exprContextRegExp: /$^/,
      exprContextCritical: false
    }
  }
}

/*
  So that webpack can inject the hot middleware runtimes
  etc, we want to pass it an array. Also to facilitate being
  able to run this script from wherever i pass it an absolute path
 */
const prepare = (entryPoints) => {
  const typecast = mapValues(entryPoints, (req) => (
    typeof req === 'string' ? [abs(req)] : abs(req)
  ))

  return process.env.ENABLE_HMR || process.argv.indexOf('--hot') >= 0
    ? mapValues(typecast, (v) => v.unshift('webpack/hot/poll?1000') && v)
    : typecast
}

const abs = (p) => project.paths.server.join(p)
