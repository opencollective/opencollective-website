import createStore from './store/node'
import ssr from './renderers/node'
import routes from './routes';

export const renderer = ssr(createStore(routes))

export default renderer
