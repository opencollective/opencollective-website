import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { reduxReactRouter } from 'redux-router';
import createHistory from 'history/lib/createBrowserHistory';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import * as reducers from '../reducers/index';
import routes from '../routes';

const combinedReducers = combineReducers(reducers);
const logger = createLogger();

const store = compose(
  applyMiddleware(thunk, logger),
  reduxReactRouter({
    routes,
    createHistory
  })

)(createStore)(combinedReducers);

export default () => store;
