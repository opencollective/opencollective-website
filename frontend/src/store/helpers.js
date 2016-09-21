import serialize from 'serialize-javascript';
import hydrate from '../actions/session/hydrate'
import initialRender from '../actions/app/initial_render'

export const helpers = (store) => (
  Object.assign(store, {
    didInitialRender() {
      store.dispatch(initialRender())
    },

    hydratedWith (data, serializeOutput = false) {
      store.dispatch(hydrate(data))

      return serializeOutput
        ? serialize(store.getState())
        : store.getState()
    }
  })
)
