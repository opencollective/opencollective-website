export const info = {
  command: 'start',
  description: 'starts a server',
  example: 'start',
  options: {
    '--hot': 'enable hot reloading',
    '--clean': 'clean up before starting'
  }
}

export const execute = (options = {}, context = {}) => {
  const { project } = context
  const cli = project.cli

  cli.banner('OpenCollective')
  cli.print('\n')

  if (project.command.options.clean) {
    project.fsx.unlink
  }
  const universalRenderer = project.getCompiler('frontend', process.env.NODE_ENV, {
    target: 'node'
  })

  const serverCompiler = project.getCompiler('server', process.env.NODE_ENV, {
    target: 'node'
  })

  const watchOptions = {
    aggregateTimeout: 400,
    poll: true
  }

  serverCompiler.plugin('emit', (compilation) => {
    project.cli.print(`The server has generated assets`, 2)
    project.cli.print(`Output path: ${project.paths.relative(project.paths.server.output)}`, 4)
  })

  universalRenderer.plugin('emit', (compilation) => {
    project.cli.print(`The server has generated assets`, 2)
    project.cli.print(`Output path: ${project.paths.relative(project.paths.server.output)}`, 4)
  })

  serverCompiler.watch(watchOptions, serverDidUpdate.bind(project))
  universalRenderer.watch(watchOptions, rendererDidUpdate.bind(project))
}


function serverDidUpdate (err, stats) {
  const project = this
  const isSuccess = stats.hasWarnings() || stats.hasErrors()

}

function rendererDidUpdate (err, stats) {
  const project = this
  const isSuccess = stats.hasWarnings() || stats.hasErrors()
}

function i18nDidUpdate (err, stats) {
  const project = this
  const isSuccess = stats.hasWarnings() || stats.hasErrors()
}
