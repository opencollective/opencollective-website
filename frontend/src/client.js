import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, applyMiddleware } from 'redux';
import { ReduxRouter, reduxReactRouter } from 'redux-router';
import { Provider } from 'react-redux';
import createHistory from 'history/lib/createBrowserHistory';

import routes from './routes';
import reducers from './reducers';
import reduxMiddleware from './redux_middleware';

import decodeJWT from './actions/session/decode_jwt';
import initialRender from './actions/app/initial_render';

const store = compose(
  reduxReactRouter({ createHistory, routes }),
  applyMiddleware(...reduxMiddleware)
)(createStore)(reducers, window.__INITIAL_STATE__);

// Decode token if stored in localStorage
store.dispatch(decodeJWT());

const rootComponent = (
  <Provider store={store}>
    <ReduxRouter/>
  </Provider>
);

const mountNode = document.getElementById('content');

ReactDOM.render(
	rootComponent,
	mountNode,
	() => store.dispatch(initialRender()));
	// initialRender is called after the initial component loads
	// so we don't refetch the data clientside
