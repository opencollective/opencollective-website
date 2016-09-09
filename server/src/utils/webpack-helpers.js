const chalk = require('colors')

function clearConsole() {
  process.stdout.write('\x1bc');
}

function handleException (error, msg) {
  console.log(msg)

  if (error.message) {
    console.log(`Error Message: ${chalk.red(error.message)}`)
  }

  if (error.stack) {
    console.log(chalk.red('Stacktrace:'))
    console.log()
    console.log(error.stack)
  }
}

const friendlySyntaxErrorLabel = 'Syntax error:'

function isLikelyASyntaxError(message) {
  return message.indexOf(friendlySyntaxErrorLabel) !== -1
}

function formatMessage(message) {
  return message
    // Make some common errors shorter:
    .replace(
      // Babel syntax error
      'Module build failed: SyntaxError:',
      friendlySyntaxErrorLabel
    )
    .replace(
      // Webpack file not found error
      /Module not found: Error: Cannot resolve 'file' or 'directory'/,
      'Module not found:'
    )
    // Internal stacks are generally useless so we strip them
    .replace(/^\s*at\s.*:\d+:\d+[\s\)]*\n/gm, '') // at ... ...:x:y
}

function outputCompilerStats(stats, onSuccess, log) {
  const hasErrors = stats.hasErrors();
  const hasWarnings = stats.hasWarnings();

  if (!hasErrors && !hasWarnings) {
    if (typeof onSuccess === 'function') {
      onSuccess(stats)
    }

    return
  }

  const json = stats.toJson({}, true)

  let formattedErrors = json.errors.map(message =>
    `Error in ${formatMessage(message)}`
  )

  const formattedWarnings = json.warnings.map(message =>
    `Warning in ${formatMessage(message)}`
  )

  if (hasErrors) {
    log(chalk.red('Failed to compile.'))
    log()

    if (formattedErrors.some(isLikelyASyntaxError)) {
      formattedErrors = formattedErrors.filter(isLikelyASyntaxError)
    }

    formattedErrors.forEach(message => {
      log(message)
      log()
    })

    return
  }

  if (hasWarnings) {
    log(chalk.yellow('Compiled with warnings.'))
    log()

    formattedWarnings.forEach(message => {
      log(message)
      log()
    })

    //console.log('You may use special comments to disable some warnings.');
    //console.log('Use ' + chalk.yellow('// eslint-disable-next-line') + ' to ignore the next line.');
    //console.log('Use ' + chalk.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.');
  }
}

module.exports = {
  clearConsole,
  handleException,
  outputCompilerStats
}
