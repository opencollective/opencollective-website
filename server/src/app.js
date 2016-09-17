import express from 'express';
import morgan from 'morgan';
import config from 'config';
import compression from 'compression';
import pkg from '../../package.json'; // eslint-disable-line
import routes from './routes';
import views from './views';
import { join } from 'path'

const {
  FRONTEND_DIST_PATH = join(process.cwd(), 'frontend', 'dist'),
  SERVER_VIEWS_PATH = join(__dirname, 'views')
} = process.env

/**
 * Express app
 */
const app = express();

app.set('views', SERVER_VIEWS_PATH)
app.set('static root', FRONTEND_DIST_PATH)

app.staticPath = (...args) => join(FRONTEND_DIST_PATH, ...args)

/**
 * Locals for the templates
 */
app.locals.version = pkg.version;
app.locals.SHOW_GA = (process.env.NODE_ENV === 'production');

app.set('trust proxy', 1) // trust first proxy for https cookies

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
views(app, {
  viewsPath: `${__dirname}/views` // we have to set this here because webpack
});

routes(app);

/**
 * 404 route
 */

app.use((req, res, next) => {
  // TODO this should redirect to a 404 page so that window location is changed
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
    message: process.env.NODE_ENV === 'production' ? 'We couldn\'t find that page :(' : `Error ${err.code}: ${err.message}`,
    stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
    options: {
      showGA: config.GoogleAnalytics.active
    }
  });
});

/**
 * Port config
 */

app.set('port', process.env.WEBSITE_PORT || process.env.PORT || 3000);

/**
 * Start server
 */
console.log(`Starting OpenCollective Website Server on port ${app.get('port')} in ${app.get('env')} environment.`);
app
  .listen(app.get('port'))
  .on('error', (err) => {
    if (err.errno === 'EADDRINUSE')
      console.error('Error: Port busy');
    else
      console.log(err);
  });

export default app;
