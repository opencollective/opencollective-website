import loadModule from '../lib/loadModule'
import { join } from 'path'

const { FRONTEND_DIST_PATH = join(process.cwd(), 'frontend', 'dist') } = process.env

/**
 * Example taken from redux-router documentation
 * https://github.com/acdlite/redux-router/tree/master/examples/server-rendering
 */
export default (req, res, next) => {
  const middleware = loadModule(join(FRONTEND_DIST_PATH, 'universal/middleware'))

  return middleware(req)
    .then((result) => {
      result.notFound ? next() : res.render('pages/app', {
        layout: false,
        meta: req.meta || {},
        html: result.html,
        initialState: result.initialState
      })
    })
}
