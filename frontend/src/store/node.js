import { createStore, compose, applyMiddleware } from 'redux';
import { reduxReactRouter } from 'redux-router/server';
import { createMemoryHistory } from 'history';
import reducers from '../reducers';
import reduxMiddleware from './middleware';

// TEMP
if (process.env.NODE_ENV === 'development') {
  reduxMiddleware.pop()
}

export function create(routes) {
  const store = compose(
    reduxReactRouter({ routes, createHistory: createMemoryHistory }),
    applyMiddleware(...reduxMiddleware)
  )(createStore)(reducers);

  return store
}

export default create
