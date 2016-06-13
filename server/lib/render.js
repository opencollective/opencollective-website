import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import { ReduxRouter } from 'redux-router';
import { reduxReactRouter, match } from 'redux-router/server';
import { createMemoryHistory } from 'history';
import serialize from 'serialize-javascript';
import qs from 'query-string';

import reducers from '../../frontend/src/reducers';
import routes from '../../frontend/src/routes';
import reduxMiddleware from '../../frontend/src/redux_middleware';
import hydrate from '../../frontend/src/actions/session/hydrate';

/**
 * Example taken from redux-router documentation
 * https://github.com/acdlite/redux-router/tree/master/examples/server-rendering
 */
export default (req, res, next) => {

  const store = compose(
    reduxReactRouter({ routes, createHistory: createMemoryHistory }),
    applyMiddleware(...reduxMiddleware)
  )(createStore)(reducers);

  const query = qs.stringify(req.query);
  const url = req.path + (query.length ? `?${query}` : '');

  store.dispatch(match(url, (error, redirectLocation, routerState) => {
    if (error) {
      console.error("error in store.dispatch: ", error);
      next(err);
    } else if (!routerState) { // 404
      console.error("No route defined in the frontend react");
      next();
    } else {
      // Pushes the data to the reducers
      store.dispatch(hydrate({
        group: req.group,
        profile: req.profile,
        subscriptions: req.subscriptions,
        jwtExpired: req.jwtExpired,
        jwtInvalid: req.jwtInvalid,
        leaderboard: req.leaderboard,
        connectedAccount: req.connectedAccount
      }));

      const initialState = serialize(store.getState());

      const html = renderToString(
        <Provider store={store} key='provider'>
          <ReduxRouter/>
        </Provider>
      );

      return res.render('pages/app', {
        layout: false,
        meta: req.meta || {},
        html,
        initialState
      });
    }
  }));
}
