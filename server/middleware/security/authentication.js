import api from '../../lib/api';
import config from 'config';
import passport from 'passport';

export default {

  authenticateService: (req, res, next) => {
    const slug = req.params.slug;
    const service = req.params.service;
    passport.authenticate(req.params.service, {
      // callback URL base must match the one configured in the service, so slug (the variable part) must come last
      callbackURL: `${config.host.website}/auth/${service}/callback/${slug}`,
      // TODO set proper scope
      scope: [ 'user:email' ]
    })(req, res, next);
  },

  authenticateServiceCallback: (req, res, next) => {
    const slug = req.params.slug;
    const service = req.params.service;
    passport.authenticate(service, (err, accessToken) => {
      if (err) {
        return next(err);
      }
      if (!accessToken) {
        return res.redirect(`${slug}/connect/${service}`);
      }
      api.post(`/connected-accounts/${service}`, JSON.stringify({ accessToken }))
        .then(() => res.redirect(`/${slug}`))
        .catch(apiErr => next(apiErr));
    })(req, res, next);
  }
};
