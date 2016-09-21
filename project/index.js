const webpack = require('webpack')

require('babel-register')

const host = require('../package.json')
const main = require(host.main || '..')

const argv = require('minimist')(process.argv)
const camelCase = require('lodash/camelCase')
const mapKeys = require('lodash/mapKeys')
const result = require('lodash/result')
const omit = require('lodash/omit')
const get = require('lodash/get')
const assign = Object.assign


const project = {
  name: host.name,
  version: host.version,

  get bin() {
    return {
      webpack: project.paths.join('node_modules','.bin','webpack')
    }
  },

  // todo this should be dynamically calculated
  get paths() {
    return main.paths
  },

  env: process.env.NODE_ENV,

  get isCLI() {
    return require.main === module
  },

  // TODO check each project to see if they have local commands
  get commands() {
    return require('./commands')
  },

  get command() {
    const parts = argv._.slice(2)

    return {
      phrase: parts.join(' '),
      namespace: parts[0],
      action: parts[1] || parts[0],
      options: mapKeys(omit(argv,'_'), (v,k) => camelCase(k))
    }
  },

  get context() {
    return {
      project,
      env: process.env.NODE_ENV,
      command: project.command,
      lodash: require('lodash'),
      cli: project.cli,
      paths: project.paths
    }
  },

  // Get an instance of the webpack compiler
  // Either frontend / server / copy
  getCompiler(sub, env = process.env.NODE_ENV || 'development', options = {}) {
    const config = project.paths.join(`${sub}/webpack.config.babel.js`)
    return webpack(
      require(config)(env, options)
    )
  },

  getWebpackBase (target, options = {}) {
    switch (target) {
      case 'node':
      case 'server':
        return require('./config/webpack.config.server.babel')(options, assign({
          paths: project.paths.server,
          project
        }, options))

      case 'copy':
      case 'i18n':
        return require('./config/webpack.config.server.babel')(options, assign({
          paths: project.paths.copy,
          project
        }, options))

      case 'web':
      case 'browser':
      case 'frontend':
      default:
        return require('./config/webpack.config.frontend.babel')(options, assign({
          paths: project.paths.server,
          project
        }, options))

    }
  },

  get gitInfo() {
    return require('./git-info')(project.paths.project)
  },

  get available() {
    return {
      get commands() {
        return Object.keys(require('./commands'))
      },

      get scripts() {
        return project.fsx.readdirSync(`${__dirname}/scripts`)
          .filter(f => f.match(/\.js/))
          .map((f) => f.replace(/.js/g,''))
      }
    }
  },

  get distributions() {
    return {
      get server() {
        return project.fsx.readdirSync(
          project.paths.server.output
        )
        .filter(f => f.match(/\.js$/))
        .map(f => f.replace(/\.js/,''))
        .map(f => ({get [f]() {
          return require(project.paths.join(`server/dist/${f}`))
        }})).reduce(Object.assign.bind({},{}), {})
      },

      get client() {
        return project.fsx.readdirSync(
          project.paths.server.output
        )
        .filter(f => f.match(/\.js$/))
        .map(f => [f, project.paths.frontend.join(`dist/${f}`)])
      }
    }
  },

  /**
   * Starts a console with the project as a local variable
   */
  console(options = {}, context = {}, onReady) {
    context.project = project
    context.fsx = project.fsx

    require('./repl')(options, context, onReady)
  },

  get(key, defaultVal) {
    return get(project, key, defaultVal)
  },

  result(key, defaultVal) {
    return result(project, key, defaultVal)
  },

  get fsx() {
    return require('./utils/fsx')
  },

  get project() {
    return this
  }
}

const cli = require('./cli/pretty-cli').attach(project)

module.exports = project

if (require.main === module) {
  require('./cli').start(project)
}
