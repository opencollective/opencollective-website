const { join, resolve, relative } = require('path')
const get = require('lodash/get')
const pkg = require('./package.json')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

if (process.env.NODE_ENV === 'development') {
  require('dotenv').load({
    silent: true,
    path: __dirname
  })
}

const env = process.env

const settings = Object.assign({
  publicPath: '/static/',
  source: 'src',
  assets: 'src/assets',
  output: 'dist',
  client: 'frontend',
  server: 'server',
  tools: 'project',
  copy: 'copy'
}, get(pkg, 'opencollective.paths', {}))

const PROJECT_ROOT = join(__dirname)
const FRONTEND_ROOT = env.FRONTEND_ROOT || join(PROJECT_ROOT, settings.client)
const COPY_ROOT = env.COPY_ROOT || join(PROJECT_ROOT, settings.copy)
const SERVER_ROOT = env.SERVER_ROOT || join(PROJECT_ROOT, settings.server)

// Provides a cleaner way of referring to locations within the project
const paths = {
  cwd: process.cwd(),

  project: PROJECT_ROOT,

  tools: join(PROJECT_ROOT, settings.tools),

  config: env.NODE_CONFIG_DIR || join(SERVER_ROOT, 'config'),

  node_modules: join(PROJECT_ROOT, 'node_modules'),

  copy: {
    context: COPY_ROOT,
    src: COPY_ROOT,
    // where the production javascript will be found
    output: join(COPY_ROOT, settings.output),

    join: (...args) => join(paths.copy.context, ...args),
    distPath: (...args) => `./${join(paths.copy.output, ...args)}`,
    srcPath: (...args) => `./${join(paths.copy.src, ...args)}`
  },

  frontend: {
    context: FRONTEND_ROOT,

    // where our main code lives
    src: join(FRONTEND_ROOT, settings.source),

    // css, images, fonts, etc.
    assets: join(FRONTEND_ROOT, settings.assets),

    // where our files get stored by webpack
    output: join(FRONTEND_ROOT, settings.output),

    publicPath: settings.publicPath || '/',

    join: (...args) => join(paths.frontend.context, ...args),
    distPath: (...args) => `./${join(paths.frontend.output, ...args)}`,
    srcPath: (...args) => `./${join(paths.frontend.src, ...args)}`
  },


  server: {
    context: SERVER_ROOT,
    src: join(SERVER_ROOT, settings.source),
    output: join(SERVER_ROOT, settings.output),
    publicPath: settings.publicPath,
    join: (...args) => join(SERVER_ROOT, ...args),
    distPath: (...args) => `./${join(paths.server.output, ...args)}`,
    srcPath: (...args) => `./${join(paths.server.src, ...args)}`
  },

  /**
   * HELPER METHODS
   *
   * Make it easier to use values from this object
   */
  join: (...args) => join(paths.project, ...args),
  resolve: (...args) => resolve(paths.project, ...args),
  relative: (...args) => relative(paths.project, ...args),
  get: (...args) => get(paths, ...args)
}

module.exports = {
  name: pkg.name,
  version: pkg.version,
  package: pkg,
  paths: paths,
  settings: settings,

  get sourcePaths() {
    return {
      copy: get(paths, 'copy.src'),
      frontend: get(paths, 'frontend.src'),
      server: get(paths, 'server.src')
    }
  },

  get distPaths() {
    return {
      copy: get(paths, 'copy.output'),
      frontend: get(paths, 'frontend.output'),
      server: get(paths, 'server.output')
    }
  }
}
