import backers from './controllers/backers';
import mw from './middlewares';
import serverStatus from 'express-server-status';
import favicon from 'serve-favicon';
import path from 'path';
import express from 'express';
import request from 'request';
import robots from 'robots.txt';

import collectives from './controllers/collectives';
import apiUrl from './utils/api_url';

import React from 'react';
import {renderToString} from 'react-dom/server';
import {Provider} from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import {ReduxRouter} from 'redux-router'; // 'redux-router'
import {reduxReactRouter, match} from 'redux-router/server'; // 'redux-router/server';
import qs from 'query-string';
import { createMemoryHistory } from 'history';
import serialize from 'serialize-javascript';


import reducers from '../frontend/src/reducers';
import routes from '../frontend/src/routes';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
const logger = createLogger();

module.exports = (app) => {

  /**
   * Server status
   */
  app.use('/status', serverStatus(app));

  /**
   * Favicon
   */
  app.use(favicon(path.join(__dirname, '/../frontend/dist/images/favicon.ico.png')));

  /**
   * Static folder
   */
  app.use('/static', express.static(path.join(__dirname, `../frontend/dist`)));

  /**
   * GET /robots.txt
   */
  app.use(robots(path.join(__dirname, '../frontend/dist/robots.txt')));

  /**
   * Pipe the requests before the middlewares, the piping will only work with raw
   * data
   * More infos: https://github.com/request/request/issues/1664#issuecomment-117721025
   */

  app.all('/api/*', (req, res) => {
    req
      .pipe(request(apiUrl(req.url)))
      .pipe(res);
  });


  /**
   * Routes
   */
  app.get('/:slug/backers/banner.md', mw.fetchUsers, backers.banner);
  app.get('/:slug/backers/:position/avatar(.png)?(.jpg)?', mw.ga, mw.fetchUsers, backers.avatar);
  app.get('/:slug/backers/:position/website', mw.ga, mw.fetchUsers, backers.redirect);
  app.get('/:slug([A-Za-z0-9-]+)/widget', mw.fetchGroupBySlug, collectives.widget);


  app.use((req, res) => {

    const store = compose(
      reduxReactRouter({ routes, createHistory: createMemoryHistory  }),
      applyMiddleware(thunk, logger)
    )(createStore)(reducers);
    // const store = reduxReactRouter({ routes, createHistory: createMemoryHistory })(createStore)(reducers);
    const query = qs.stringify(req.query);
    const url = req.path + (query.length ? '?' + query : '');

    store.dispatch(match(url, (error, redirectLocation, routerState) => {
      if (error) {
        console.error('Router error:', error);
        res.status(500).send(error.message);
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (!routerState) {
        res.status(400).send('Not Found');
      } else {
         const initialState = serialize(store.getState());

  const markup = renderToString(
    <Provider store={store} key="provider">
      <ReduxRouter/>
    </Provider>
  );

        res.render('pages/collective', {
          layout: false,
          meta: {},
          html: '',
          initialState
        });
      }
    }));
  });
}
