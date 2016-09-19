import 'expose?$assets!./assets/paths' // eslint-disable-line
import createStore from './store/node'
import ssr from './renderers/node'
import Routes from './routes';

/**
 * Creates an express middleware compatible renderer
*/
export const createMiddleware = (store, routes = Routes) => {
  store = store || createStore(routes)
  return ssr(store)
}

export const store = createStore(Routes)

export const getRoutes = () => {
  return Routes
}

/**
 * Gives us a function we can pass to express
 */
export default createMiddleware(store, Routes)
