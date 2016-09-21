import path from 'path'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

export default (app, options = {}) => {

  const compiler = app.devCompiler || require('.').compiler(options.compiler || 'website')

  const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: compiler.options.output.publicPath,
    noInfo: true,
    quiet: true,
    stats: false
  })

  app.use(devMiddleware)

  app.use(webpackHotMiddleware(compiler))

  const fs = devMiddleware.fileSystem

  app.get('*', (req, res) => {
    fs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {
      if (err) {
        res.sendStatus(404);
      } else {
        res.send(file.toString());
      }
    })
  })
}
