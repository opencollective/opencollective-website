import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import { ReduxRouter } from 'redux-router';
import { reduxReactRouter, match } from 'redux-router/server';
import { createMemoryHistory } from 'history';
import serialize from 'serialize-javascript';
import qs from 'query-string';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import reducers from '../../frontend/src/reducers';
import routes from '../../frontend/src/routes';
import { success as fetchedGroup } from '../../frontend/src/actions/groups/fetch_by_id';

const logger = createLogger();
const store = compose(
  reduxReactRouter({ routes, createHistory: createMemoryHistory }),
  applyMiddleware(thunk, logger)
)(createStore)(reducers);

/**
 * Example taken from redux-router documentation
 * https://github.com/acdlite/redux-router/tree/master/examples/server-rendering
 */

export default (req, res, next) => {
  const query = qs.stringify(req.query);
  const url = req.path + (query.length ? `?${query}` : '');
  const group = req.group;

  store.dispatch(match(url, (error, redirectLocation, routerState) => {
    if (error) {
      next(err);
    } else if (!routerState) { // 404
      next();
    } else {

      if (group) {
        store.dispatch(fetchedGroup(group.id, {
          groups: { [group.id]: group }
        }));
      }

      const initialState = serialize(store.getState());

      const html = renderToString(
        <Provider store={store} key='provider'>
          <ReduxRouter/>
        </Provider>
      );

      res.render('pages/app', {
        layout: false,
        meta: req.meta || {},
        html,
        initialState
      });
    }
  }));
}