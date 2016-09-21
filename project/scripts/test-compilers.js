/* eslint-disable-next-line */
const proj = global.project

const compilers = [
  proj.getCompiler('frontend', process.env.NODE_ENV, { target: 'web' }),
  proj.getCompiler('frontend', process.env.NODE_ENV, { target: 'node' }),
  proj.getCompiler('server', process.env.NODE_ENV, { target: 'node' }),
  proj.getCompiler('copy', process.env.NODE_ENV, { target: 'node' })
]

compilers.forEach((compiler,i) => {
  compiler.plugin('done', (stats) => {
    if (stats.hasErrors() || stats.hasWarnings()) {
      proj.cli.print(`COMPILER ${i} FAILED due to Build Errors and Warnings`)
      proj.cli.print(stats.toString('minimal'), 8)
    }
  })

  compiler.plugin('fail', (err) => {
    if (err) {
      proj.cli.print(`COMPILER ${i} FAILED with a fatal error`.red, 2)
      proj.cli.print(err.message)
      console.log(err)
      process.exit(1)
    }
  })
})

compilers.forEach(compiler => compiler.run(() => {
  proj.cli.print('Compiler finished running.')
}))
