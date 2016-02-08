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

import apiUrl from './utils/api_url';
import renderClient from './utils/render_client';
import busted from './helpers/busted';

/**
 * Express app
 */
const app = express();

/**
 * Locals for the templates
 */
app.locals.busted = busted;

/**
 * Server status
 */
app.use('/status', serverStatus(app));

/**
 * Favicon
 */
app.use(favicon(__dirname + '/../static/images/favicon.ico.png'));

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
app.use('/static', express.static(path.join(__dirname, '../static')));

/**
 * GET /robots.txt
 */
app.use(robots(path.join(__dirname, '../static/robots.txt')));

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
app.set('views', __dirname + '/views');
app.set('view cache', config.viewCache);
app.set('view engine', 'ejs');

/**
 * Server public page
 */

app.get('/:slug([A-Za-z0-9-]+)', (req, res, next) => {

  const slug = req.params.slug.toLowerCase();

  request
    .get({
      url: apiUrl(`groups/${slug}/`),
      json: true
    }, (err, response, group) => {
      if (err) {
        return next(err);
      }

      if (response.statusCode !== 200) {
        return next(response.body.error);
      }

      // Meta data for facebook and twitter links (opengraph)
      const meta = {
        url: group.publicUrl,
        title: `Join ${group.name}'s open collective`,
        description: `${group.name} is collecting funds to continue their activities. Chip in!`,
        image: group.image || group.logo,
        twitter: `@${group.twitterHandle}`,
      };

      // The initial state will contain the group
      const initialState = {
        groups: {
          [group.id]: group
        }
      };

      // Server side rendering of the client application
      const html = renderClient(initialState);

      res.render('index', {
        meta,
        html,
        initialState,
        options: {
          showGA: process.env.NODE_ENV === 'production'
        }
      });
    });
});

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

  console.log('err', err);
  console.log('err', err.stack);

  if (res.headersSent) {
    return next(err);
  }

  res.render('error', {
    message: 'Error ' + err.code + ': ' + err.message,
    options: {
      showGA: process.env.NODE_ENV === 'production'
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
    console.log('Express server listening on port ' + app.get('port'));
  });

}

module.exports = app;
