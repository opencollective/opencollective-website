import isFunction from 'lodash/isFunction'
import result from 'lodash/result'
import defaults from 'lodash/defaults'
import get from 'lodash/get'

// import {describe} from '../utils/describe-component'

export function start(project, context = {}) {
  const { cli } = project

  cli.registerCommand('showHelp', (...args) => displayHelp(project, ...args))

  if (project.command.namespace === '') {
    cli.banner('OpenCollective')
    cli.showHelp()
  } else if (project.available.commands.indexOf(project.command.namespace) === -1) {
    const cmd = project.command.phrase

    if (project.available.scripts.indexOf(cmd) !== -1) {
      global.project = project
      project.cli.print(`Running the ${cmd} script.`)
      require(`${__dirname}/../scripts/${cmd}`)
    } else {
      cli.banner('OpenCollective')
    }
  } else {
    const command = findCommand(project.command, project)

    // the first argument to any command
    const params = defaults({}, project.command.options, result(command, 'defaults'))

    // the 2nd argument to any command
    const ctx = { ...context, project, env: project.env, command: project.command }

    command.execute(params, ctx)
  }
}

const displayHelp = (project) => {
  const { cli, commands } = project

  cli.print(`Available Commands`.bold.underline)
  cli.paddedList(
    Object.keys(commands).reduce((memo, key) => {
      const command = commands[key]
      memo[command.info.command] = command.info.description
      return memo
    }, {})
  )

  cli.print('\n')
}

const findCommand = (command, project) => {
  const result = project.commands[command.namespace]

  if (!isFunction(result.execute)) {
    throw 'Invalid command: must export an execute method and an info property'
  }

  return {
    execute: result.execute,
    validate: get(result, 'validate', () => true),
    help: get(result, 'help', (params, context) => {
      context.project.cli.print(`\n\n${command.phrase} does not have any help.`)
    })
  }
}
