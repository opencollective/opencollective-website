import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { ReduxRouter, reduxReactRouter } from 'redux-router';
import { Provider } from 'react-redux';
import createHistory from 'history/lib/createBrowserHistory';

import routes from './routes';
import reducers from './reducers';

const logger = createLogger();

const store = compose(
  reduxReactRouter({ createHistory }),
  applyMiddleware(thunk, logger)
)(createStore)(reducers, window.__INITIAL_STATE__);

const rootComponent = (
  <Provider store={store}>
    <ReduxRouter routes={routes} />
  </Provider>
);

const mountNode = document.getElementById('content');

ReactDOM.render(rootComponent, mountNode);
