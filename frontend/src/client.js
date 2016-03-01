import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, applyMiddleware } from 'redux';
import { ReduxRouter, reduxReactRouter } from 'redux-router';
import { Provider } from 'react-redux';
import createHistory from 'history/lib/createBrowserHistory';

import routes from './routes';
import reducers from './reducers';
import reduxMiddleware from './redux_middleware';

const store = compose(
  reduxReactRouter({ createHistory }),
  applyMiddleware(...reduxMiddleware)
)(createStore)(reducers, window.__INITIAL_STATE__);

const rootComponent = (
  <Provider store={store}>
    <ReduxRouter routes={routes} />
  </Provider>
);

const mountNode = document.getElementById('content');

ReactDOM.render(rootComponent, mountNode);
