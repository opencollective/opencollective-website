import banner from './controllers/banner';
import mw from './middlewares';
import serverStatus from 'express-server-status';
import favicon from 'serve-favicon';
import path from 'path';
import express from 'express';
import request from 'request';
import robots from 'robots.txt';

import collectives from './controllers/collectives';
import apiUrl from './utils/api_url';
import render from './lib/render';


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
  app.get('/:slug/banner.md', mw.cache(300), mw.fetchGroupBySlug, mw.fetchUsers(), banner.markdown);
  app.get('/:slug/:tier/banner.md', mw.cache(300), mw.fetchGroupBySlug, mw.fetchUsers(), banner.markdown);
  app.get('/:slug/:tier/badge.svg', mw.cache(300), mw.fetchUsers(), banner.badge);
  app.get('/:slug/badge/:tier.svg', mw.cache(300), mw.fetchUsers(), banner.badge);
  app.get('/:slug/:tier/:position/avatar(.:format(png|jpg|svg))?', mw.cache(300), mw.ga, mw.fetchUsers({cache: 300}), banner.avatar);
  app.get('/:slug/:tier/:position/website', mw.ga, mw.fetchUsers(), banner.redirect);
  app.get('/:slug([A-Za-z0-9-]+)/widget', mw.cache(300), mw.fetchGroupBySlug, collectives.widget);

  /**
   * Server side render the react app
   *
   * NOTE:
   * When we refactor PublicGroup to fetch the group in the container, we can remove
   * the explicit routes and just do `app.use(render)`
   */
  app.get('/leaderboard', mw.ga, mw.fetchLeaderboard, mw.addTitle('Open Collective Leaderboard'), render);
  app.get('/subscriptions/:token', mw.ga, mw.fetchSubscriptionsByUserWithToken, mw.addTitle('My Subscriptions'), render);
  app.get('/subscriptions', mw.ga, mw.fetchSubscriptionsByUserWithToken, mw.addTitle('My Subscriptions'), render);
  app.get('/:slug([A-Za-z0-9-]+)', mw.ga, mw.fetchGroupBySlug, mw.addMeta, render);
  app.get('/:slug([A-Za-z0-9-]+)/:type', mw.ga, mw.fetchGroupBySlug, mw.addMeta, render);
  app.get('/:slug([A-Za-z0-9-]+)/expenses/new', mw.ga, mw.fetchGroupBySlug, mw.addMeta, render);
  app.get('/:slug([A-Za-z0-9-]+)/donate/:amount', mw.ga, mw.fetchGroupBySlug, mw.addMeta, render);
  app.get('/:slug([A-Za-z0-9-]+)/donate/:amount/:interval', mw.ga, mw.fetchGroupBySlug, mw.addMeta, render);
};