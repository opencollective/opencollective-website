import express from 'express';
import morgan from 'morgan';
import config from 'config';
import compression from 'compression';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
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
 * Authentication
 */
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
const serviceCallback = (accessToken, refreshToken, profile, done) => done(null, accessToken);

passport.use(new GitHubStrategy({
  clientID: config.github.clientId,
  clientSecret: config.github.clientSecret
}, serviceCallback));

// TODO add twitter etc strategies

app.use(passport.initialize());

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

app.set('port', process.env.WEBSITE_PORT || 3000);

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

module.exports = app;
