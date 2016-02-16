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
  app.get('/:slug/backers/:position/avatar', mw.ga, mw.fetchUsers, backers.avatar);
  app.get('/:slug/backers/:position/website', mw.ga, mw.fetchUsers, backers.redirect);
  app.get('/:slug([A-Za-z0-9-]+)', mw.fetchGroupBySlug, collectives.show);
  app.get('/:slug([A-Za-z0-9-]+)/widget', mw.fetchGroupBySlug, collectives.widget);

}
