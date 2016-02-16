import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import {
  ReduxRouter,
  reduxReactRouter,
} from 'redux-router';

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

// First render to match markup from server
ReactDOM.render(rootComponent, mountNode);
// Optional second render with dev-tools
ReactDOM.render((
  <div>
    {rootComponent}
  </div>
), mountNode);

// import React from 'react';
// import ReactDOM from 'react-dom';
// import { createStore, compose } from 'redux';
// import {
//   ReduxRouter,
//   reduxReactRouter,
// } from 'redux-router';
// import {Route} from 'react-router';

// import { Provider } from 'react-redux';
// import createHistory from 'history/lib/createBrowserHistory';

// import reducers from './reducers';
// import PublicGroup from './containers/PublicGroup';
// import Subscriptions from './containers/Subscriptions';


// const store = compose(
//   reduxReactRouter({ createHistory })
// )(createStore)(reducers, window.__INITIAL_STATE__);

// ReactDOM.render((
//   <div>
//     <Provider store={store}>
//       <ReduxRouter routes={routes} />
//     </Provider>
//   </div>
// ), document.querySelector('#content'));

// export default (
//   <div>
//     <Provider store={store}>
//       <ReduxRouter routes={routes} />
//     </Provider>
//   </div>
// );