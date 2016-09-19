import { join, parse } from 'path'
import findCache from 'find-cache-dir'

export const info = {
  command: 'console',
  description: 'starts a console inside the server side app context',
  example: 'console',
  options: {
    '--compiler': 'load the console with the output of the specified compiler in the context',
    '--hot': 'enable hot reloading in the console'
  }
}

export function execute (options = {}, context = {}) {
  const { project } = context
  const cli = project.cli

  cli.banner()

  cli.print()
  cli.print('Available Helpers'.blue.underline + ':', 2) // eslint-disable-line
  cli.print(`\nThe following commands are available by default to help you.\n`, 2)

  cli.paddedList({
    project: 'Get access to the project metadata store',
    universal: 'Access the universal distribution modules',
    server: 'Access the built server module',
    stats: 'Access the build stats metadata'
  })

  cli.print('\n')

  require('../repl')({
    historyFile: join(process.cwd(), '.repl-history')
  }, {
    project,

    get universal() {
      return gateway(project, project.paths.frontend.join('dist/universal'))
    },

    get server () {
      return gateway(project, project.paths.server.output)
    },

    get stats() {
      return gateway(project, project.paths.join('stats'))
    }

  }, (err, replServer) => {
    if (!err) {
      replServer.commands['reload'] = {
        help: 'Reload the module cache',
        action: function () {
          Object.keys(require.cache).filter(
            id => id.startsWith(process.cwd())
          ).forEach(id => delete require.cache[id])
          }
      }
    }
  })
}

const gateway = (project, folder) =>
  project.fsx.readdirSync(folder)
    .reduce((acc, file) => {
      const path = parse(file)

      if (path.ext.match(/\.js/)) {
        Object.assign(acc, {
          get [path.name]() {
            return require(`${folder}/${path.name}${path.ext}`)
          }
        })
      }

      return acc
    }, {})
