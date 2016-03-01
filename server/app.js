import express from 'express';
import morgan from 'morgan';
import _ from 'lodash';
import config from 'config';
import compression from 'compression';
import pkg from '../package.json';

/**
 * Express app
 */
const app = express();

/**
 * Locals for the templates
 */
app.locals.version = pkg.version;
app.locals.SHOW_GA = (process.env.NODE_ENV === 'production');


/**
 * Log
 */
app.use(morgan('dev'));

/**
 * Compress assets
 */
app.use(compression());

/**
 * Handlebars template engine
 */
require('./views')(app);
require('./routes')(app);

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

  res
  .status(err.code || 500)
  .render('pages/error', {
    layout: false,
    message: process.env.NODE_ENV === 'development' ? `Error ${err.code}: ${err.message}` : 'We couldn\'t find that page :(',
    stack: process.env.NODE_ENV === 'development' ? err.stack : '',
    options: {
      showGA: config.GoogleAnalytics.active
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