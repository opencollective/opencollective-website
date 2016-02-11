import express from 'express';
import serverStatus from 'express-server-status';
import favicon from 'serve-favicon';
import request from 'request';
import morgan from 'morgan';
import path from 'path';
import _ from 'lodash';
import robots from 'robots.txt';
import config from 'config';
import compression from 'compression';
import pkg from '../package.json';

import collectives from './controllers/collectives';
import params from './params';
import apiUrl from './utils/api_url';

/**
 * Express app
 */
const app = express();

/**
 * Locals for the templates
 */
app.locals.version = pkg.version;

/**
 * Server status
 */
app.use('/status', serverStatus(app));

/**
 * Favicon
 */
app.use(favicon(path.join(__dirname, '/../frontend/static/images/favicon.ico.png')));

/**
 * Log
 */
app.use(morgan('dev'));

/**
 * Compress assets
 */
app.use(compression());

/**
 * Static folder
 */
app.use('/static', express.static(path.join(__dirname, `../frontend/static`)));
app.use('/static/js', express.static(path.join(__dirname, `../frontend/dist/js`)));
app.use('/static/css', express.static(path.join(__dirname, `../frontend/dist/css`)));

/**
 * GET /robots.txt
 */
app.use(robots(path.join(__dirname, '../frontend/static/robots.txt')));

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
 * Ejs template engine
 */
app.set('views', path.join(__dirname, '/views'));
app.set('view cache', config.viewCache);
app.set('view engine', 'ejs');

/**
 * Routes
 */

app.param('slug', params.slug);

app.get('/:slug([A-Za-z0-9-]+)', collectives.show);
app.get('/:slug([A-Za-z0-9-]+)/widget', collectives.widget);

/**
 * 404 route
 */

app.use((req, res, next) => {
  return next({
    code: 404,
    message: 'We can\'t find that page.'
  });
});

/**
 * Error handling
 */

app.use((err, req, res, next) => {

  console.log('Error', err);
  console.log('Error stack', err.stack);

  if (res.headersSent) {
    return next(err);
  }

  res.render('pages/error', {
    message: `Error ${err.code}: ${err.message}`,
    stack: process.env.NODE_ENV === 'development' ? err.stack : '',
    options: {
      showGA: config.showGA
    }
  });
});

/**
 * Port config
 */

app.set('port', process.env.PORT || 3000);

if (!_.contains(['test', 'circleci'], app.set('env'))) {
  /**
   * Start server
   */
  app.listen(app.get('port'), () => {
    console.log(`Express server listening on port ${app.get('port')}`);
  });

}

module.exports = app;
