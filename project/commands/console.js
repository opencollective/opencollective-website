
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
    store: 'Creates an instance of the redux store',
    project: 'Get access to the project metadata store',
    renderer: 'Get an instance of the universal renderer',
    copy: 'Get access to the project i18n strings',
    dist: 'Get info about the builds'
  })

  cli.print('\n')

  require('../repl')({}, {
    project,

    get store() {
      return require(
        project.paths.join('server/dist/store')
      )
    },

    get renderer() {
      return require(
        project.paths.join('server/dist/store/renderers/website')
      )
    },

    get copy() {
      return require(
        project.paths.join('copy/dist').default
      )
    }

  }, (replServer) => {
    if (project.command.options.compiler) {
      const compiler = replServer.context.compiler = project.compiler(project.command.options.compiler)

      compiler.start().then(result => {
        replServer.context.result = result
      })

      if (project.command.options.hot) {
        replServer.context.watcher = compiler.watch({
          aggregateTimeout: 2000,
          poll: false
        }, didReceiveUpdate)
      }
    }
  })
}

const didReceiveUpdate = (err, stats) => {

}

export function help (options = {}, context = {}) {

}

export function validate (options = {}, context = {}) {

}
