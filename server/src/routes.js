import mw from './middlewares';
import serverStatus from 'express-server-status';
import favicon from 'serve-favicon';
import path from 'path';
import express from 'express';
import request from 'request';
import robots from 'robots.txt';
import * as controllers from './controllers';
import apiUrl from './utils/api_url';
import { render, renderJSON } from './lib/render';
import { getCloudinaryUrl } from './lib/utils';

export default (app) => {

  /**
   * Redirects
   */
  app.get('/consciousnesshackingsf', (req, res) => res.redirect('/chsf'));
  app.get('/consciousnesshackingsv', (req, res) => res.redirect('/chsv'));
  app.get('/github/apply/:token', (req, res) => res.redirect(`/opensource/apply/${req.params.token}`));
  app.get('/github/apply', (req, res) => res.redirect('/opensource/apply'));

  /**
   * Server status
   */
  app.use('/status', serverStatus(app));

  /**
   * Favicon
   */
  app.use(favicon(path.join(__dirname, '/../../frontend/dist/images/favicon.ico.png')));

  /**
   * Static folder
   */
  app.use('/static', express.static(path.join(__dirname, `../../frontend/dist`), { maxAge: '1d' }));

  /**
   * GET /robots.txt
   */
  app.use(robots(path.join(__dirname, '../../frontend/dist/robots.txt')));

  /**
   * Proxy all images so that we can serve them from the opencollective.com domain
   * and we can cache them at cloudflare level (to reduce bandwidth at cloudinary level)
   * Format: /proxy/images?src=:encoded_url&width=:width
   */
  app.get('/proxy/images', (req, res) => {
    const width = req.query.width;
    const height = req.query.height;
    const query = req.query.query;

    const url = getCloudinaryUrl(req.query.src, { width, height, query });

    req
      .pipe(request(url, { followRedirect: false }))
      .on('error', (e) => {
        console.error("error proxying ", url, e);
        res.status(500).send(e);
      })
      .pipe(res);
  });

  /**
   * Pipe the requests before the middlewares, the piping will only work with raw
   * data
   * More infos: https://github.com/request/request/issues/1664#issuecomment-117721025
   */
  app.all('/api/*', (req, res) => {
    req
      .pipe(request(apiUrl(req.url), { followRedirect: false }))
      .on('error', (e) => {
        console.error("error calling api", apiUrl(req.url), e);
        res.status(500).send(e);
      })
      .pipe(res);
  });

  /**
  * Email Subscription
  */
  app.get('/services/email/unsubscribe', mw.ga, controllers.emails.unsubscribe, render);
  app.get('/services/email/approve', mw.ga, controllers.emails.approve, render);

  /**
   * Routes
   */
  app.get('/:slug/banner.md', mw.maxAge(300), mw.fetchGroupBySlug, mw.fetchActiveUsers(), controllers.banner.markdown);
  app.get('/:slug/banner.js', mw.maxAge(3000), mw.fetchGroupBySlug, mw.fetchActiveUsers(), controllers.banner.js);
  app.get('/:slug/:tier.md', mw.maxAge(300), mw.fetchGroupBySlug, mw.fetchActiveUsers(), controllers.banner.markdown);
  app.get('/:slug/:tier.json', mw.maxAge(900), mw.fetchActiveUsers(), renderJSON('users'));
  app.get('/:slug/:tier.:format(svg|png)', mw.maxAge(300), mw.fetchActiveUsers(), controllers.banner.banner);
  app.get('/:slug/:tier/badge.svg', mw.maxAge(300), mw.fetchActiveUsers({requireAvatar: false}), controllers.banner.badge);
  app.get('/:slug/badge/:tier.svg', mw.maxAge(300), mw.fetchActiveUsers({requireAvatar: false}), controllers.banner.badge);
  app.get('/:slug/:tier/:position/avatar(.:format(png|jpg|svg))?', mw.maxAge(300), mw.ga, mw.fetchActiveUsers({cache: 300}), controllers.banner.avatar);
  app.get('/:slug/:tier/:position/website', mw.ga, mw.fetchActiveUsers(), controllers.banner.redirect);
  app.get('/:slug([A-Za-z0-9-]+)/widget', mw.maxAge(300), mw.fetchProfileBySlug, controllers.widgets.profile);
  app.get('/:slug([A-Za-z0-9-]+)/widget.js', mw.maxAge(3000), controllers.widgets.js);

  /**
   * Server side render the react app
   *
   * NOTE:
   * When we refactor PublicGroup to fetch the group in the container, we can remove
   * the explicit routes and just do `app.use(render)`
   */
  app.get('/', mw.maxAge(3000), mw.ga, mw.addTitle('OpenCollective - A New Form of Association, Transparent by Design'), controllers.homepage, render);
  app.get('/about', mw.maxAge(3000), mw.ga, mw.addTitle('About'), render);
  app.get('/discover/:tag?', mw.ga, mw.addTitle('Discover'), render);
  app.get('/faq', mw.maxAge(3000), mw.ga, mw.addTitle('Answers'), render);
  app.get('/create', mw.ga, mw.addTitle('Create a new collective'), render);
  app.get('/addgroup', mw.ga, mw.addTitle('Create a new group'), render);
  app.get('/login/:token', mw.ga, mw.addTitle('Open Collective'), render);
  app.get('/login', mw.ga, mw.addTitle('Open Collective Login'), render);
  app.get('/opensource/apply/:token', mw.ga, mw.extractGithubUsernameFromToken, mw.addTitle('Sign up your Github repository'), render);
  app.get('/opensource/apply', mw.ga, mw.addTitle('Sign up your Github repository'), render);
  app.get('/:slug/apply', mw.ga, mw.fetchProfileBySlug, controllers.hosts.apply, render);
  app.get('/connect/github', mw.ga, render);
  app.get('/:slug/:tier\.:format(json|csv)', mw.maxAge(3000), mw.ga, mw.fetchGroupBySlug, controllers.tierList); // <-------- WIP
  app.get('/:slug/:tier', mw.ga, mw.fetchGroupBySlug, render); // <-------- WIP
  app.get('/:slug/connect/:provider', mw.ga, render);
  app.get('/:slug/edit-twitter', mw.ga, mw.fetchProfileBySlug, render);
  app.get('/:slug/edit', mw.ga, mw.addTitle('Edit'), mw.fetchGroupBySlug, mw.addMeta, render);
  app.get('/:slug/settings', mw.ga, mw.addTitle('Settings'), mw.fetchGroupBySlug, mw.addMeta, render);
  app.get('/subscriptions', mw.ga, mw.addTitle('My Subscriptions'), render);
  app.get('/:slug([A-Za-z0-9-_]+)/connected-accounts', mw.ga, render);
  // TODO: #cleanup remove next two routes when new collective page is live
  app.get('/:slug([A-Za-z0-9-_]+)/donate/:amount', mw.ga, mw.fetchGroupBySlug, mw.addMeta, render);
  app.get('/:slug([A-Za-z0-9-_]+)/donate/:amount/:interval', mw.ga, mw.fetchGroupBySlug, mw.addMeta, render);
  app.get('/:slug([A-Za-z0-9-_]+)/:type(expenses|donations|transactions)', mw.ga, mw.fetchGroupBySlug, mw.addMeta, render);
  app.get('/:slug([A-Za-z0-9-]+)/transactions/:transactionid/invoice.pdf', mw.maxAge(300), controllers.transactions.invoice);
  app.get('/:slug([A-Za-z0-9-_]+)/expenses/:action(new)', mw.ga, mw.fetchGroupBySlug, mw.addMeta, render);
  app.get('/:slug([A-Za-z0-9-_]+)/expenses/:expenseid/:action(approve|reject)', mw.ga, mw.fetchProfileBySlug, mw.addMeta, render);
  app.get('/:slug([A-Za-z0-9-_]+)/donations/:action(request)', mw.ga, mw.fetchProfileBySlug, mw.addMeta, render);
  app.get('/:slug([A-Za-z0-9-_]+)/donate/:amount/:interval/:description', mw.ga, mw.fetchGroupBySlug, mw.addMeta, render);
  app.get('/:slug([A-Za-z0-9-_]+)', mw.ga, mw.fetchProfileBySlug, mw.addMeta, render);

  app.use(mw.handleUncaughtError);
};
