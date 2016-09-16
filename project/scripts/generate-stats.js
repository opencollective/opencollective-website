const spawn = require('child-process-promise').spawn
const project = require('..')
const createWriteStream = require('fs').createWriteStream
const omit = require('lodash/omit')

project.fsx.mkdirp('stats')

const cmd = (args, opts) => {
  const promise = spawn(`${process.cwd()}/node_modules/.bin/webpack`, args.split(' '), omit(opts, 'name'))
  const output = createWriteStream(project.paths.join('stats', `${opts.name}.json`))
  promise.childProcess.stdout.pipe(output)

  return promise
}

const tests = [
  cmd('--env development --target web --profile --json', {
    name: 'frontend-web-dev',
    cwd: project.paths.join('frontend'),
    env: {
      ...process.env,
      NODE_ENV: 'development'
    }
  }),

  cmd('--env development --target node --profile --json', {
    name: 'frontend-node-dev',
    cwd: project.paths.join('frontend'),
    env: {
      ...process.env,
      NODE_ENV: 'development'
    }
  }),

  cmd('--env development --target node --profile --json', {
    name: 'server-node-dev',
    cwd: project.paths.join('server'),
    env: {
      ...process.env,
      NODE_ENV: 'development'
    }
  }),

  // Production Compilers
  cmd('--env production --target node --profile --json', {
    name: 'server-node-production',
    cwd: project.paths.join('server'),
    env: {
      ...process.env,
      NODE_ENV: 'production'
    }
  }),

  cmd('--env production --target web --profile --json', {
    name: 'frontend-web-production',
    cwd: project.paths.join('frontend'),
    env: {
      ...process.env,
      NODE_ENV: 'production'
    }
  }),

  cmd('--env production --target node --profile --json', {
    name: 'frontend-node-production',
    cwd: project.paths.join('frontend'),
    env: {
      ...process.env,
      NODE_ENV: 'production'
    }
  })
]

Promise.all(tests)
  .then((results) => {
    project.cli.clear()
    project.cli.print(`SUCCESS`.green.bold, 2)
    project.cli.print(`All ${results.length} compilers exited without errors`, 2)
  })

  .catch((error) => {
    project.cli.clear()
    project.cli.print('FAILURE'.red.underline, 2)
    project.cli.print('Details below:', 2)
    project.cli.print(`${error.message}`, 4)
  })
