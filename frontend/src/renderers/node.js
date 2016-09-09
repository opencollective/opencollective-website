import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { ReduxRouter } from 'redux-router'
import { match } from 'redux-router/server';
import serialize from 'serialize-javascript';
import qs from 'query-string';
import hydrate from '../actions/session/hydrate'

export const create = (store) => (req) => {
  const query = qs.stringify(req.query);
  const url = req.path + (query.length ? `?${query}` : '');

  return new Promise((resolve, reject) => {
    store.dispatch(match(url, (error, redirectLocation, routerState) => {
      if (error) {
        console.error("error in store.dispatch: ", error);
        reject(error)
      } else if (redirectLocation) {
        resolve({redirectLocation})
      } else if (!routerState) { // 404
        resolve({notFound: true})
      } else {
        // Pushes the data to the reducers
        store.dispatch(hydrate({
          group: req.group,
          subscriptions: req.subscriptions,
          leaderboard: req.leaderboard,
          connectedAccount: req.connectedAccount,
          homepage: req.homepage
        }));

        const initialState = serialize(store.getState());

        const html = renderToString(
          <Provider store={store} key='provider'>
            <ReduxRouter/>
          </Provider>
        );

        resolve({
          url,
          html,
          initialState
        })
      }
    }));
  })
}

export default create
