import { createStore, compose, applyMiddleware } from 'redux';
import { reduxReactRouter } from 'redux-router';
import createHistory from 'history/lib/createBrowserHistory';
import reducers from '../reducers';
import reduxMiddleware from './middleware';
import decodeJWT from '../actions/session/decode_jwt';

export function create(routes, initialState) {
  const store = compose(
    reduxReactRouter({ createHistory, routes}),
    applyMiddleware(...reduxMiddleware)
  )(createStore)(reducers, initialState);

  // Decode token if stored in localStorage
  store.dispatch(decodeJWT());

  return store
}

export default create
