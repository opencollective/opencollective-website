import { renderer } from '../renderer'

/**
 * Example taken from redux-router documentation
 * https://github.com/acdlite/redux-router/tree/master/examples/server-rendering
 */
export function middleware (req, res, next) {
  renderer(req)
    .then((result) => {
      if (result.notFound) {
        next()
      } else if (result.redirectLocation) {
        res.redirect(result.redirectLocation)
      } else if (result.html) {
        return res.render('pages/app', {
          layout: false,
          meta: req.meta || {},
          html: result.html,
          initialState: result.initialState
        })
      }
    })
    .catch((error) => next(error))
}

export default middleware
