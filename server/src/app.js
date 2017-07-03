import express from 'express';
import https from 'https';
import fs from 'fs';
import morgan from 'morgan';
import config from 'config';
import compression from 'compression';
import pkg from '../../package.json'; // eslint-disable-line
import routes from './routes';
import views from './views';

/**
 * Express app
 */
const app = express();

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
views(app);
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
      showGA: config.GoogleAnalytics && config.GoogleAnalytics.active
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
console.log(`DEBUG=${process.env.DEBUG}`);
console.log(`VCR_MODE=${process.env.VCR_MODE}`);
app
  .listen(app.get('port'))
  .on('error', (err) => {
    if (err.errno === 'EADDRINUSE')
      console.error('Error: Port busy');
    else
      console.log(err);
  });

// https server needed for testing apple pay
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" // Avoids DEPTH_ZERO_SELF_SIGNED_CERT error for self-signed certs
const privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
const certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};

https.createServer(credentials, app).listen(8443);

export default app;
