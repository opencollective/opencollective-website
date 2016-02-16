import { createStore, applyMiddleware, compose } from 'redux';
import { reduxReactRouter } from 'redux-router';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import reducers from '../reducers';
import routes from '../routes';
import PublicGroup from '../containers/PublicGroup';
import Subscriptions from '../containers/Subscriptions';

const logger = createLogger();

export default (initialState={}) => {
  return  compose(
    applyMiddleware(thunk, logger),
    reduxReactRouter({
      routes,
      createHistory
    })
  )(createStore)(combinedReducers);
};