import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import * as reducers from '../reducers/index';

const combinedReducers = combineReducers(reducers);
const logger = createLogger();

const store = compose(
  applyMiddleware(thunk, logger)
)(createStore)(combinedReducers);

export default () => store;